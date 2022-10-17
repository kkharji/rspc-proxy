import {
  ProceduresDef,
  SubscriptionOptions,
  createClient as _createClient
} from "@rspc/client";
import { ClientOperationProxyRenames, ClientProxy } from "./type";
import { _createProxy } from "./utils/createProxy";

export function createClientProxy<TProcedures extends ProceduresDef>(
  client: ReturnType<typeof _createClient<TProcedures>>
): ClientProxy<TProcedures> {

  let execute = (
    method: keyof typeof client | string,
    input: [key: string] | [string, any] | [string, [] | [any]],
    opts: SubscriptionOptions<any> | undefined,
  ) => {
    switch (method) {
      case "query":
        return client.query(input as any)
      case "mutation":
        return client.mutation(input as any)
      case "addSubscription":
        return client.addSubscription(input as any, opts!)
    }
  }

  let proxy = _createProxy(({ keys, params }) => {

    // Return early if a single key is given
    if (keys.length === 1) {
      let [method, input, opts]: [string, any, any] = [keys[0], params[0], params[1]];

      console.debug("NonProxy", { method, input, opts })
      return execute(method, input, opts)
    }

    const method = ClientOperationProxyRenames[keys.pop()!];
    const key = keys.join('.');

    // Assuming the last params to be an object representing options
    // .. Add it back if it's not an object
    let opts: any = params.pop();
    if (typeof opts !== "object" && !Array.isArray(opts)) {
      params.push(opts);
      opts = undefined;
    }
    const input: any = [key, ...params];

    console.debug("Proxy", { key, input, opts })
    return execute(method, input, opts);
  })

  return proxy as any
}

export { _createProxy }
