import type * as http from "node:http";

export interface Route {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  handler: RouteHandler;
}

export interface RouteHandler {
  (req: http.IncomingMessage, res: http.ServerResponse): void;
}
