import {
  type HttpServerConfiguration,
  getDefault,
} from "./HttpServerConfiguration.ts";
import * as http from "node:http";

export class HttpServer {
  private server: http.Server;

  constructor(private readonly config: HttpServerConfiguration) {
    this.server = http.createServer(this.handleRequest.bind(this));
    this.server.listen(this.config.port, this.config.hostname, () => {
      console.log(
        `Server listening on: ${this.config.hostname}:${this.config.port}`,
      );
    });
  }

  private handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ) {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/plain");
    response.end("Hello world");
  }
}
