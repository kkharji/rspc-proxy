/** @jsxImportSource solid-js */
import { RSPCError, Client, createClient, NoOpTransport } from "@rspc/client";
import { createSolidQueryHooks } from "@rspc/solid";
import { createSolidQueryHooksProxy } from "../src";
import { QueryClient } from "@tanstack/solid-query";
import { Procedures } from "./../../example/bindings";

export const rspc = createSolidQueryHooks<Procedures>();
const proxy = createSolidQueryHooksProxy(rspc);

