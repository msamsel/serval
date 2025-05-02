import { HttpRequest } from './HttpRequest.ts';
import { Logger } from './Logger.ts';
import type { Route, RouteHandler } from './Route.ts';

export class Router {
  private routes = new Map<string, Route>();

  constructor(private readonly logger: Logger) {}

  public addRoute(path: string, method: HttpRequest['method'], handler: RouteHandler) {
    const key = this.key(method, path);
    if (this.routes.has(key)) {
      throw new Error(`Route ${path} already exists`);
    }

    this.routes.set(key, {
      path,
      method,
      handler,
    });

    this.logger.log(`Added route ${path} ${method}`);
  }

  public getRoute(method: HttpRequest['method'], path: string): Route | undefined {
    return this.routes.get(this.key(method, path));
  }

  public key(method: HttpRequest['method'], path: string): string {
    return `${path}:${method}`;
  }
}
