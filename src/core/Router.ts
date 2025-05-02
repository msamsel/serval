import { Logger } from "./Logger.ts";
import { Route, RouteHandler } from "./Route.ts";

export class Router {
  private routes = new Map<string, Route>();

  constructor(private readonly logger: Logger) {}

  public addRoute(
    path: string,
    method: Route["method"],
    handler: RouteHandler,
  ) {
    if (this.routes.has(path)) {
      throw new Error(`Route ${path} already exists`);
    }

    this.routes.set(path, {
      path,
      method,
      handler,
    });

    this.logger.log(`Added route ${path} ${method}`);
  }

  public getRoute(path: string): Route | undefined {
    return this.routes.get(path);
  }
}
