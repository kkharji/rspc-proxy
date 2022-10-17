import { _createProxy } from "@rspc-proxy/client";
import { SolidQueryHooks, SolidQueryProxy } from "./type";
import { ProceduresDef } from "@rspc/client";

const HooksOperationProxyRenames: Record<string, keyof SolidQueryHooks<any>> = {
  query: 'createQuery',
  mutate: 'createMutation',
} as const;

const isProduction = window
  ? !window.location.host.match("localhost")
  : true // todo: set for node?

export function createSolidQueryHooksProxy<TProcedures extends ProceduresDef>(
  hooks: SolidQueryHooks<TProcedures>
): SolidQueryProxy<TProcedures> {
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
      case "createQuery": {
        return hooks.createQuery(() => input, opts)
      }
      case "createMutation": {
        return hooks.createMutation(key, opts)
      }
    }
  }) as any
}
