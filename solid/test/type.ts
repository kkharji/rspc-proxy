/** @jsxImportSource solid-js */
import { RSPCError, Client, createClient, NoOpTransport } from "@rspc/client";
import { createSolidQueryHooks } from "@rspc/solid";
import { QueryClient } from "@tanstack/solid-query";
import { Procedures } from "./../../example/bindings";

export const rspc = createSolidQueryHooks<Procedures>();

