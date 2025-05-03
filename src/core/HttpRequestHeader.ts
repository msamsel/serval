import { strict as assert } from 'node:assert';
import type * as http from 'node:http';

export class HttpRequestHeader {
  private static readonly supportedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;

  private constructor(
    public readonly url: URL,
    public readonly method: (typeof HttpRequestHeader.supportedMethods)[number],
  ) {}

  get path(): string {
    return this.url.pathname;
  }

  static fromMessage(hostname: string, message: http.IncomingMessage): HttpRequestHeader {
    assert(typeof message.url === 'string');
    const url = URL.parse(message.url, hostname);
    assert(url instanceof URL);
    assert(typeof message.method === 'string');
    this.assertRequestMethod(message.method);

    return new HttpRequestHeader(url, message.method);
  }

  private static assertRequestMethod(
    method: unknown,
  ): asserts method is (typeof HttpRequestHeader.supportedMethods)[number] {
    if (typeof method !== 'string') {
      throw new Error('Method must be a string');
    }

    if (!HttpRequestHeader.supportedMethods.includes(method as (typeof HttpRequestHeader.supportedMethods)[number])) {
      throw new Error(`Unsupported method: ${method}`);
    }
  }
}
