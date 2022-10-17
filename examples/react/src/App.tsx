import React from 'react'
import ReactDOM from 'react-dom/client'

import { rspc, RspcProvider } from './rspc'
import Counter from './components/Counter'

function App() {
  const { data: version } = rspc.version.query([]);
  const { data: transformMe } = rspc.transformMe.query([]);
  const { data: echo } = rspc.echo.query(["Hello From Frontend!"]);
  const { mutate, isLoading } = rspc.sendMsg.mutate();
  const { error } = rspc.error.query([], {
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
