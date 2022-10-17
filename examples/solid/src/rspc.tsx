import { createClient, FetchTransport } from "@rspc/client";
import { createSolidQueryHooks } from "@rspc/solid";
import { createSolidQueryHooksProxy } from "@rspc-proxy/solid";
import { QueryClient } from "@tanstack/solid-query";
import { Procedures } from "../../bindings";
import { FlowProps } from "solid-js";


const hooks = createSolidQueryHooks<Procedures>();
const client = createClient<Procedures>({
  transport: new FetchTransport("http://localhost:8071/rspc"),
});


export const queryClient = new QueryClient();
export const rspc = createSolidQueryHooksProxy<Procedures>(hooks);

export const RspcProvider = (props: FlowProps<{}>) => <hooks.Provider
  client={client}
  queryClient={queryClient}
  children={props.children}
/>
