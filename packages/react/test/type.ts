import { RSPCError, Client, createClient, NoOpTransport } from "@rspc/client";
import { createReactQueryHooks } from "@rspc/react";
import { QueryClient } from "@tanstack/react-query";
import { Procedures } from "./../../example/bindings";

export const rspc = createReactQueryHooks<Procedures>();
