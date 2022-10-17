import { _createProxy } from "@rspc-proxy/client";
import { BaseOptions, createReactQueryHooks } from "@rspc/react";
import {
  inferMutationInput,
  inferMutationResult,
  inferProcedureKey,
  inferProcedures,
  inferQueryResult,
  inferSubscriptionResult,
  ProceduresDef,
  RSPCError,
  _inferProcedureHandlerInput
} from "@rspc/client";
import { UseQueryOptions, UseQueryResult, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

type QueryInput<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "queries">
  > = _inferProcedureHandlerInput<inferProcedures<P>, "queries", K>;

type MutationInput<
  T extends ProceduresDef,
  K extends inferProcedureKey<T, "mutations">
  > = inferMutationInput<inferProcedures<T>, K> extends never
  ? undefined
  : inferMutationInput<inferProcedures<T>, K>

type SubscriptionInput<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "subscriptions">
  > = _inferProcedureHandlerInput<inferProcedures<P>, "subscriptions", K>

type QueryOptions<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "queries">,
  Result = inferQueryResult<inferProcedures<P>, K>,
  > = Omit<UseQueryOptions<
    Result,
    RSPCError,
    Result
  >, "queryFn" | "queryKey">
  & BaseOptions<inferProcedures<P>>;

type MutationOptions<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "mutations">
  > = UseMutationOptions<
    inferMutationResult<inferProcedures<P>, K>,
    RSPCError,
    MutationInput<P, K>,
    unknown
  > & BaseOptions<inferProcedures<P>>

type SubscriptionOptions<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "subscriptions">
  > = {
    enabled?: boolean;
    onStarted?: () => void;
    onData: (data: inferSubscriptionResult<inferProcedures<P>, K>) => void;
    onError?: (err: RSPCError) => void;
  } & BaseOptions<inferProcedures<P>>;

type QueryResult<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "queries">
  > = UseQueryResult<
    inferQueryResult<inferProcedures<P>, K>,
    RSPCError
  >;

type MutationResult<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "mutations">
  > = UseMutationResult<
    inferMutationResult<inferProcedures<P>, K>,
    RSPCError,
    inferMutationInput<inferProcedures<P>, K>,
    unknown
  >


type Root<Part> = Part extends `${infer ParamName}.${string}` ? ParamName : never;

type inferClientOperationFunction<
  P extends ProceduresDef,
  O extends keyof ProceduresDef,
  K extends inferProcedureKey<P, O>,
  > = O extends "queries" ? {
    query(input: QueryInput<P, K>, opts?: QueryOptions<P, K>): QueryResult<P, K>
  }
  : O extends "mutations" ? {
    mutate(opts?: MutationOptions<P, K>): MutationResult<P, K>
  }
  : O extends "subscriptions" ? {
    subscribe(input: SubscriptionInput<P, K>, opts: SubscriptionOptions<P, K>): void
  }
  : never;

type resolveKey<
  P extends ProceduresDef,
  O extends keyof ProceduresDef,
  K extends string,
  Origin extends string,
  isRoot extends boolean = false
  > = K extends `${infer LHS}.${infer RHS}`
  ? isRoot extends true
  ? resolveKey<P, O, RHS, K>
  : { [S in LHS]: resolveKey<P, O, RHS, K>; }
  : isRoot extends true
  ? inferClientOperationFunction<P, O, Origin>
  : { [S in K]: inferClientOperationFunction<P, O, Origin>; }

type inferProxy<
  P extends ProceduresDef,
  O extends keyof ProceduresDef,
  > = {
    [Key in inferProcedureKey<P, O> as
    Root<Key> extends never ? Key : Root<Key>
    ]: resolveKey<P, O, Key, Root<Key> extends never ? Key : "", true>
  }

export type ReactQueryHooks<T extends ProceduresDef> =
  ReturnType<typeof createReactQueryHooks<T>>;

export type ReactQueryProxy<TProcedures extends ProceduresDef> =
  inferProxy<TProcedures, "queries"> &
  inferProxy<TProcedures, "mutations"> &
  inferProxy<TProcedures, "subscriptions">
