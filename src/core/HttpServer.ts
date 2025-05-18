import { type HttpServerConfiguration } from './HttpServerConfiguration';
import * as http from 'node:http';
import { Logger } from './Logger';
import { Router } from './Router';
import type { RouteHandler } from './Route';
import { HttpRequest } from './HttpRequest';
import { HttpRequestHeader } from './HttpRequestHeader';

export class HttpServer {
  private readonly server: http.Server;

  private readonly router: Router;

  constructor(
    private readonly config: HttpServerConfiguration,
    private readonly logger: Logger,
  ) {
    this.server = http.createServer((req, res) => {
      void this.handleRequest(req, res);
    });
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

  private async handleRequest(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    const header = HttpRequestHeader.fromMessage(`http://${this.config.hostname}`, request);

    const route = this.router.getRoute(header.method, header.path);

    if (!route) {
      this.sendNotFound(response);
      return;
    }

    if (route.method !== header.method) {
      this.sendMethodNotAllowed(response);
      return;
    }

    return new Promise((resolve) => {
      let rawData = '';

      request.on('data', (chunk) => {
        rawData += chunk;
      });

      request.on('end', () => {
        const httpRequest = new HttpRequest(header, rawData, request);

        route.handler(httpRequest, response);
        resolve();
      });
    });
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
