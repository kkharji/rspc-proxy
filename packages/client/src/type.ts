// Proxy
import {
  Client,
  inferProcedureKey,
  inferProcedureResult,
  inferProcedures,
  inferSubscriptionResult,
  ProceduresDef,
  SubscriptionOptions,
  _inferProcedureHandlerInput
} from "@rspc/client";

export const ClientOperationProxyRenames: Record<string, keyof Client<any>> = {
  query: 'query',
  mutate: 'mutation',
  subscribe: "addSubscription"
} as const;

export type ClientOperationProxyKey =
  keyof typeof ClientOperationProxyRenames;

type Root<Part> = Part extends `${infer ParamName}.${string}` ? ParamName : never;

type inferClientOperationFunction<
  TProcedures extends ProceduresDef,
  TOperation extends keyof ProceduresDef,
  Key extends inferProcedureKey<TProcedures, TOperation>,
  Result = inferProcedureResult<inferProcedures<TProcedures>, TOperation, Key>,
  SubOpts = SubscriptionOptions<inferSubscriptionResult<TProcedures, Key>>,
  > = TOperation extends "queries" ? _inferProcedureHandlerInput<TProcedures, TOperation, Key> extends [] ? {
    query(args: _inferProcedureHandlerInput<TProcedures, TOperation, Key>): Promise<Result>
  } : {
    query(): Promise<Result>
  }
  : TOperation extends "mutations" ? { mutate(args: _inferProcedureHandlerInput<TProcedures, TOperation, Key>): Promise<Result> }
  : TOperation extends "subscriptions" ? { subscribe(args: _inferProcedureHandlerInput<TProcedures, TOperation, Key>, opts: SubOpts): () => void }
  : never;

type resolveClientKeyOperation<
  TProcedures extends ProceduresDef,
  TOperation extends keyof ProceduresDef,
  Key extends string,
  Full extends string,
  isRoot extends boolean = false
  > = Key extends `${infer LHS}.${infer RHS}`
  ? isRoot extends true
  ? resolveClientKeyOperation<TProcedures, TOperation, RHS, Key>
  : { [S in LHS]: resolveClientKeyOperation<TProcedures, TOperation, RHS, Key>; }
  : isRoot extends true
  ? inferClientOperationFunction<TProcedures, TOperation, Full>
  : { [S in Key]: inferClientOperationFunction<TProcedures, TOperation, Full>; }

type inferClientOperationProxy<
  TProcedures extends ProceduresDef,
  TOperation extends keyof ProceduresDef,
  > = {
    [Key in inferProcedureKey<TProcedures, TOperation> as
    Root<Key> extends never ? Key : Root<Key>
    ]: resolveClientKeyOperation<
      TProcedures,
      TOperation,
      Key,
      Root<Key> extends never ? Key : "",
      true
    >
  }

export type ClientProxy<TProcedures extends ProceduresDef> =
  inferClientOperationProxy<TProcedures, "queries"> &
  inferClientOperationProxy<TProcedures, "mutations"> &
  inferClientOperationProxy<TProcedures, "subscriptions">
