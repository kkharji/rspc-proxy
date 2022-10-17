use async_stream::stream;
use axum::{
    extract::Path,
    http::{HeaderValue, Method},
    routing::get,
};
use rspc::Config;
use std::{
    net::SocketAddr,
    path::PathBuf,
    sync::{Arc, Mutex},
};
use tokio::time::sleep;
use tokio::time::Duration;
use tower_http::cors::CorsLayer;

mod count;
mod utils;

#[derive(Clone, Debug)]
pub struct Ctx {
    pub count: Arc<Mutex<i32>>,
}

pub type Router = rspc::Router<Ctx>;
pub type RouterBuilder = rspc::RouterBuilder<Ctx>;

#[tokio::main]
async fn main() {
    let addr = "[::]:8071".parse::<SocketAddr>().unwrap();
    let count = Arc::new(Mutex::new(0));
    let router = Router::new()
        .query("version", |t| t(|_, _: ()| "0.0.1"))
        .merge("count.", count::mount())
        .mutation("sendMsg", |t| {
            t(|_, v: String| {
                println!("Client said [{v}]");
                v
            })
        })
        .query("echo", |t| {
            t(|_, v: String| {
                println!("echo [{v}]");
                format!("Got {v}")
            })
        })
        .query("error", |t| {
            t(|_, _: ()| {
                println!("Requested error");
                Err(rspc::Error::new(
                    rspc::ErrorCode::InternalServerError,
                    "Something went wrong".into(),
                )) as Result<String, rspc::Error>
            })
        })
        .query("transformMe", |t| {
            t(|_, _: ()| {
                println!("transformMe");
                "Hello, world!".to_string()
            })
        })
        .subscription("pings", |t| {
            t(|_ctx, _args: ()| {
                stream! {
                    println!("Client subscribed to 'pings'");
                    for i in 0..5 {
                        println!("Sending ping {}", i);
                        yield "ping".to_string();
                        sleep(Duration::from_secs(1)).await;
                    }
                }
            })
        });

    let config = Config::new()
        .set_ts_bindings_header("/* eslint-disable */")
        .export_ts_bindings(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../bindings.ts"));

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3001".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET]);

    let server = axum::Server::bind(&addr)
        .serve(
            axum::Router::new()
                .route("/", get(|| async { "Hello 'rspc'!" }))
                .route("/rspc/:id", {
                    router
                        .config(config)
                        .build()
                        .arced()
                        .endpoint(move |id: Path<String>| Ctx {
                            count: count.clone(),
                        })
                        .axum()
                })
                .layer(cors)
                .into_make_service(),
        )
        .with_graceful_shutdown(utils::axum_shutdown_signal());

    println!("{} listening on http://{}", env!("CARGO_CRATE_NAME"), addr);

    server.await.expect("Error with HTTP server!");
}
