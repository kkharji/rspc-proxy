const HooksOperationProxyRenames: Record<string, keyof ReactQueryHooks<any>> = {
  query: 'useQuery',
  mutate: 'useMutation',
  subscribe: 'useSubscription'
} as const;

import { _createProxy } from "@rspc-proxy/client";
import { ProceduresDef } from "@rspc/client";
import { ReactQueryHooks, ReactQueryProxy } from "./type";

const isProduction = window
  ? !window.location.host.match("localhost")
  : true // todo: set for node?

export function createReactQueryHooksProxy<TProcedures extends ProceduresDef>(
  hooks: ReactQueryHooks<TProcedures>
): ReactQueryProxy<TProcedures> {
  return _createProxy(({ keys, params }) => {
    const method = HooksOperationProxyRenames[keys.pop()!];
    const key = keys.join('.');

    // Assuming the last params to be an object representing options
    // .. Add it back if it's not an object
    let opts: any = params.pop();
    if (opts && (typeof opts !== "object" || Array.isArray(opts))) {
      params.push(opts);
      opts = undefined;
    }
    const input: any = [key, ...params.flat()];

    if (!isProduction) {
      console.debug("Proxy", { key, input, opts })
    }

    switch (method) {
      case "useQuery": {
        return hooks.useQuery(input, opts)
      }
      case "useMutation": {
        return hooks.useMutation(key, opts)
      }
      case "useSubscription": {
        return hooks.useSubscription(input, opts)
      }
    }
  }) as any
}
