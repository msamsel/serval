import { HttpServer, config } from "../src/index.ts";

const app = new HttpServer(config.getDefault());

console.log("Hello world");
