import { strict as assert } from "node:assert";
import { type HttpServerConfiguration } from "./HttpServerConfiguration.ts";
import * as http from "node:http";
import { Logger } from "./Logger.ts";
import { Router } from "./Router.ts";
import { RouteHandler } from "./Route.ts";

export class HttpServer {
  private readonly server: http.Server;

  private readonly router: Router;

  constructor(
    private readonly config: HttpServerConfiguration,
    private readonly logger: Logger,
  ) {
    this.server = http.createServer(this.handleRequest.bind(this));
    this.server.listen(this.config.port, this.config.hostname, () => {
      this.logger.log(
        `Server listening on: ${this.config.hostname}:${this.config.port}`,
      );
    });

    this.router = new Router(this.logger);
  }

  public get(path: string, handler: RouteHandler) {
    this.router.addRoute(path, "GET", handler);
  }

  private handleRequest(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ) {
    assert(typeof request.url === "string");
    const url = URL.parse(request.url, `http://${this.config.hostname}`);
    assert(url instanceof URL);

    const route = this.router.getRoute(url.pathname);

    if (!route) {
      this.sendNotFound(response);
      return;
    }

    if (route.method !== request.method) {
      this.sendMethodNotAllowed(response);
      return;
    }

    route.handler(request, response);
  }

  private sendNotFound(response: http.ServerResponse) {
    response.statusCode = 404;
    response.end("Not Found");
  }

  private sendMethodNotAllowed(response: http.ServerResponse) {
    response.statusCode = 405;
    response.end("Method Not Allowed");
  }
}
