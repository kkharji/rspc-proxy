use super::*;
use rspc::Type;
use serde::Deserialize;

#[derive(Deserialize, Type)]
pub enum UpdateCount {
    Inc,
    Dec,
}

pub(super) fn mount() -> RouterBuilder {
    <RouterBuilder>::new()
        .query("get", |t| t(|state, _: ()| *state.count.lock().unwrap()))
        .mutation("set", |t| {
            t(|state, req: UpdateCount| {
                let mut count = state.count.lock().unwrap();
                match req {
                    UpdateCount::Inc => *count = *count + 1,
                    UpdateCount::Dec => *count = *count - 1,
                }
            })
        })
}
