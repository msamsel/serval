import type * as http from 'node:http';
import { HttpRequestHeader } from './HttpRequestHeader.ts';

export class HttpRequest {
  constructor(
    public readonly header: HttpRequestHeader,
    public readonly body: string,
    public readonly _message: http.IncomingMessage,
  ) {}

  get path(): string {
    return this.header.path;
  }
}
