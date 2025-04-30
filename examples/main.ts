import { Logger } from "../src/core/Logger.ts";
import { HttpServer, config } from "../src/index.ts";

const app = new HttpServer(config.getDefault(), new Logger());

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello world");
});
