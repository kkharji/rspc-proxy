import React from 'react'
import ReactDOM from 'react-dom/client'

import { hooks, RspcProvider } from './rspc'
import Counter from './components/Counter'

function App() {
  const { data: version } = hooks.useQuery(["version"]);
  const { data: transformMe } = hooks.useQuery(["transformMe"]);
  const { data: echo } = hooks.useQuery(["echo", "Hello From Frontend!"]);
  const { mutate, isLoading } = hooks.useMutation("sendMsg");
  const { error } = hooks.useQuery(["error"], {
    retry: false,
  });

  return (
    <div style={{ border: "black 1px solid", }}
    >
      <h1>Fetch</h1>
      <p>Using rspc version: {version}</p>
      <p>Echo response: {echo}</p>
      <p>
        Error returned: {error?.code} {error?.message}
      </p>
      <p>Transformed Query: {transformMe}</p>
      <button onClick={() => mutate("Hello!")} disabled={isLoading}>
        Send Msg!
      </button>
      <Counter />
    </div>
  );

}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RspcProvider>
      <App />
    </RspcProvider>
  </React.StrictMode>
)
