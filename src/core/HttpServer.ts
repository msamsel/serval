import { type HttpServerConfiguration } from './HttpServerConfiguration.ts';
import * as http from 'node:http';
import { Logger } from './Logger.ts';
import { Router } from './Router.ts';
import type { RouteHandler } from './Route.ts';
import { HttpRequest } from './HttpRequest.ts';

export class HttpServer {
  private readonly server: http.Server;

  private readonly router: Router;

  constructor(
    private readonly config: HttpServerConfiguration,
    private readonly logger: Logger,
  ) {
    this.server = http.createServer(this.handleRequest.bind(this));
    this.server.listen(this.config.port, this.config.hostname, () => {
      this.logger.log(`Server listening on: ${this.config.hostname}:${this.config.port}`);
    });

    this.router = new Router(this.logger);
  }

  public get(path: string, handler: RouteHandler) {
    this.router.addRoute(path, 'GET', handler);
  }

  public post(path: string, handler: RouteHandler) {
    this.router.addRoute(path, 'POST', handler);
  }

  public put(path: string, handler: RouteHandler) {
    this.router.addRoute(path, 'PUT', handler);
  }

  public delete(path: string, handler: RouteHandler) {
    this.router.addRoute(path, 'DELETE', handler);
  }

  public patch(path: string, handler: RouteHandler) {
    this.router.addRoute(path, 'PATCH', handler);
  }

  private handleRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    const httpRequest = HttpRequest.fromMessage(this.config.hostname, request);

    const route = this.router.getRoute(httpRequest.method, httpRequest.path);

    if (!route) {
      this.sendNotFound(response);
      return;
    }

    if (route.method !== httpRequest.method) {
      this.sendMethodNotAllowed(response);
      return;
    }

    route.handler(request, response);
  }

  private sendNotFound(response: http.ServerResponse) {
    response.statusCode = 404;
    response.end('Not Found');
  }

  private sendMethodNotAllowed(response: http.ServerResponse) {
    response.statusCode = 405;
    response.end('Method Not Allowed');
  }
}
