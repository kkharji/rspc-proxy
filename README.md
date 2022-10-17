# rspc-proxy

Experimental proxy for [rspc](https://github.com/oscartbeaumont/rspc). provides an a index
based access to running query/mutate/subscribe with support for nested keys and keys with
different operations. WARNING: Maybe deprecated and moved to rspc core repo. only 0.1.2 is
supported.

## Usage

```typescript
import { createClient, FetchTransport } from "@rspc/client";
import { createReactQueryHooks } from "@rspc/react";
import { createReactQueryHooksProxy } from "@rspc-proxy/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Procedures } from "../../bindings";

const queryClient = new QueryClient();
const hooks = createReactQueryHooks<Procedures>();
const rspc = createReactQueryHooksProxy(hooks);

const client = createClient<Procedures>({
  transport: new FetchTransport("http://localhost:8071/rspc"),
});

export const RspcProvider = (props: { children: any }) =>
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <hooks.Provider client={client} queryClient={queryClient}
      children={props.children}
    />
  </QueryClientProvider>

rspc.version.query();
rspc.sendMsg.mutate("Hello using proxy");
rspc.pings.subscribe({
  onData(msg) {
    console.log(msg)
  }
})
```

## Install

### Client

#### NPM
```bash
npm install @rspc-proxy/client # required  @rspc/client
```
#### PNPM
```bash
pnpm add @rspc-proxy/client # required  @rspc/client
```

### React

#### NPM
```bash
npm install @rspc-proxy/react # required  @rspc/react
```
#### PNPM
```bash
pnpm add @rspc-proxy/react # required  @rspc/react
```

### Solid

#### NPM
```bash
npm install @rspc-proxy/solid # required  @rspc/solid
```
#### PNPM
```bash
pnpm add @rspc-proxy/solid # required  @rspc/solid
```
