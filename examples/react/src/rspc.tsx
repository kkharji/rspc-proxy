import { createClient, FetchTransport } from "@rspc/client";
import { createReactQueryHooks } from "@rspc/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";

import type { Procedures } from "../../bindings";

const client = createClient<Procedures>({
  transport: new FetchTransport("http://localhost:8071/rspc"),
});

export const hooks = createReactQueryHooks<Procedures>();
export const queryClient = new QueryClient();

export const RspcProvider = (props: { children: ReactElement }) =>
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <hooks.Provider client={client} queryClient={queryClient}
      children={props.children}
    />
  </QueryClientProvider>
