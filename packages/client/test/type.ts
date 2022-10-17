import { NoOpTransport, createClient, } from "@rspc/client";
import { createClientProxy } from "../src";
import {  Procedures } from "../../example/bindings";

const client = createClient<Procedures>({
  transport: new NoOpTransport(),
});

const proxy = createClientProxy(client)

