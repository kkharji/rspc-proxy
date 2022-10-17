/* @refresh reload */
import { Component, Show } from 'solid-js';
import { render } from 'solid-js/web';
import Counter from './components/Counter';
import { rspc, RspcProvider } from './rspc';

const DefaultFallback = () => <>Loading ...</>

function Example({ name }: { name: string }) {
  const echo = rspc.echo.query(["mymsg"], {
    refetchOnWindowFocus: false
  });
  const version = rspc.version.query();
  const transformMe = rspc.transformMe.query();
  const sendMsg = rspc.sendMsg.mutate({
    onMutate() {
      console.log("message sent")
    }
  });
  const error = rspc.error.query({
    retry: 0, // note does not work
  });

  return (
    <div >
      <h1>{name}</h1>
      <p>Using rspc version:{" "}
        <Show when={!version.isLoading} fallback={<DefaultFallback />}>
          {version.data}
        </Show>
      </p>
      <p> Error returned:{" "}
        <Show when={!error.isLoading} fallback={<DefaultFallback />}>
          {error.error?.code} {" "}
          {error.error?.message}
        </Show>
      </p>
      <p>Echo response:{" "}
        <Show when={!echo.isLoading} fallback={<DefaultFallback />}>
          {echo.data}
        </Show>
      </p>

      <p>Transformed Query:{" "}
        <Show when={!transformMe.isLoading} fallback={<DefaultFallback />}>
          {transformMe.data}
        </Show>
      </p>
      <button
        disabled={sendMsg.isLoading}
        onClick={() => sendMsg.mutate("Hello From solid Proxy")}
      >
        Send Msg!
      </button>
      <Counter />
    </div>
  );
}
const App: Component = () => {
  return (
    <div>
      <Example name='Fetch' />
    </div>
  );
};

render(() =>
  <RspcProvider>
    <App />
  </RspcProvider>
  ,
  document.body
);
