import type * as http from 'node:http';
import { HttpRequest } from './HttpRequest.ts';

export interface Route {
  path: string;
  method: HttpRequest['method'];
  handler: RouteHandler;
}

export type RouteHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void;
