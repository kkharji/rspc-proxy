import { _createProxy } from "@rspc-proxy/client";
import { BaseOptions, createSolidQueryHooks } from "@rspc/solid";
import {
  inferMutationInput,
  inferMutationResult,
  inferProcedureKey,
  inferProcedures,
  inferQueryResult,
  ProceduresDef,
  RSPCError,
  _inferProcedureHandlerInput
} from "@rspc/client";
import {
  CreateMutationOptions,
  CreateMutationResult,
  CreateQueryOptions,
  CreateQueryResult
} from "@tanstack/solid-query";

type Root<Part> = Part extends `${infer ParamName}.${string}` ? ParamName : never;

type QueryInput<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "queries">
  > = _inferProcedureHandlerInput<inferProcedures<P>, "queries", K>;


type QueryOptions<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "queries">,
  Result = inferQueryResult<inferProcedures<P>, K>,
  > = Omit<CreateQueryOptions<
    Result,
    RSPCError,
    Result
  >, "queryFn" | "queryKey">
  & BaseOptions<inferProcedures<P>>;

type QueryResult<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "queries">
  > = CreateQueryResult<
    inferQueryResult<inferProcedures<P>, K>,
    RSPCError
  >;

type MutationInput<
  T extends ProceduresDef,
  K extends inferProcedureKey<T, "mutations">
  > = inferMutationInput<inferProcedures<T>, K> extends never
  ? undefined
  : inferMutationInput<inferProcedures<T>, K>

type MutationOptions<
  P extends ProceduresDef,
  K extends inferProcedureKey<P, "mutations">
  > = CreateMutationOptions<
    inferMutationResult<inferProcedures<P>, K>,
    RSPCError,
    MutationInput<P, K>,
    unknown
  > & BaseOptions<inferProcedures<P>>

type MutationResult<
  T extends ProceduresDef,
  K extends inferProcedureKey<T, "mutations">
  > = CreateMutationResult<
    inferMutationResult<inferProcedures<T>, K>,
    RSPCError,
    inferMutationInput<inferProcedures<T>, K>,
    unknown
  >

type inferClientOperationFunction<
  T extends ProceduresDef,
  O extends keyof ProceduresDef,
  K extends inferProcedureKey<T, O>,
  > = O extends "queries"
  ? QueryInput<T, K> extends []
  ? { query(opts?: QueryOptions<T, K>): QueryResult<T, K> }
  : { query(args: QueryInput<T, K>, opts?: QueryOptions<T, K>): QueryResult<T, K> }
  : O extends "mutations" ? {
    mutate(opts?: MutationOptions<T, K>): MutationResult<T, K>
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

export type SolidQueryHooks<T extends ProceduresDef> =
  ReturnType<typeof createSolidQueryHooks<T>>;

export type SolidQueryProxy<TProcedures extends ProceduresDef> =
  inferProxy<TProcedures, "queries"> &
  inferProxy<TProcedures, "mutations"> &
  inferProxy<TProcedures, "subscriptions">
