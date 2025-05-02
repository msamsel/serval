import type * as http from 'node:http';
import { strict as assert } from 'node:assert';

export class HttpRequest {
  private static readonly supportedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;

  constructor(
    public readonly url: URL,
    public readonly method: (typeof HttpRequest.supportedMethods)[number],
    readonly message: http.IncomingMessage,
  ) {}

  get path(): string {
    return this.url.pathname;
  }

  static fromMessage(hostname: string, message: http.IncomingMessage): HttpRequest {
    assert(typeof message.url === 'string');
    const url = URL.parse(message.url, hostname);
    assert(url instanceof URL);
    assert(typeof message.method === 'string');
    this.assertRequestMethod(message.method);

    return new HttpRequest(url, message.method, message);
  }

  private static assertRequestMethod(method: unknown): asserts method is (typeof HttpRequest.supportedMethods)[number] {
    if (typeof method !== 'string') {
      throw new Error('Method must be a string');
    }

    if (!HttpRequest.supportedMethods.includes(method as (typeof HttpRequest.supportedMethods)[number])) {
      throw new Error(`Unsupported method: ${method}`);
    }
  }
}
