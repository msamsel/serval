import type * as http from 'node:http';
import { HttpRequest } from './HttpRequest';
import { HttpRequestHeader } from './HttpRequestHeader';

export interface Route {
  path: string;
  method: HttpRequestHeader['method'];
  handler: RouteHandler;
}

export type RouteHandler = (req: HttpRequest, res: http.ServerResponse) => void;
