/* eslint-disable */
// 微信小程序环境补丁：提供 Headers / fetch API 兼容层

// @ts-nocheck
(function () {
  if (typeof Headers === 'undefined') {
    class HeadersPolyfill {
      _headers: Record<string, string> = {};
      constructor(init?: Record<string, string> | HeadersPolyfill) {
        if (init instanceof HeadersPolyfill) {
          this._headers = { ...init._headers };
        } else if (init) {
          Object.keys(init).forEach(k => {
            this._headers[k.toLowerCase()] = String(init[k]);
          });
        }
      }
      get(name: string) { return this._headers[name.toLowerCase()] || null; }
      set(name: string, value: string) { this._headers[name.toLowerCase()] = String(value); }
      has(name: string) { return this._headers[name.toLowerCase()] !== undefined; }
      forEach(cb: (v: string, k: string) => void) {
        Object.entries(this._headers).forEach(([k, v]) => cb(v, k));
      }
      *entries(): IterableIterator<[string, string]> {
        for (const [k, v] of Object.entries(this._headers)) yield [k, v];
      }
      *keys(): IterableIterator<string> {
        for (const k of Object.keys(this._headers)) yield k;
      }
      *values(): IterableIterator<string> {
        for (const v of Object.values(this._headers)) yield v;
      }
      [Symbol.iterator]() { return this.entries(); }
    }
    // @ts-ignore
    globalThis.Headers = HeadersPolyfill;
  }

  if (typeof Request === 'undefined') {
    class RequestPolyfill {
      url: string;
      headers: any;
      method: string;
      body: any;
      constructor(input: string | { url?: string; headers?: any; method?: string; body?: any }, init?: any) {
        if (typeof input === 'string') {
          this.url = input;
          this.headers = init?.headers ? new (globalThis as any).Headers(init.headers) : new (globalThis as any).Headers();
          this.method = init?.method || 'GET';
          this.body = init?.body;
        } else {
          this.url = (input as any).url || '';
          this.headers = new (globalThis as any).Headers((input as any).headers);
          this.method = (input as any).method || 'GET';
          this.body = (input as any).body;
        }
      }
    }
    // @ts-ignore
    globalThis.Request = RequestPolyfill;
  }

  if (typeof Response === 'undefined') {
    class ResponsePolyfill {
      status: number;
      ok: boolean;
      headers: any;
      _body: string;
      constructor(body: string, init?: { status?: number; headers?: any }) {
        this._body = body || '';
        this.status = init?.status || 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.headers = init?.headers ? new (globalThis as any).Headers(init.headers) : new (globalThis as any).Headers();
      }
      text() { return Promise.resolve(this._body); }
      json() { return Promise.resolve(JSON.parse(this._body)); }
    }
    // @ts-ignore
    globalThis.Response = ResponsePolyfill;
  }

  if (typeof fetch === 'undefined') {
    (globalThis as any).fetch = function (input: string, init?: any): Promise<any> {
      return new Promise((resolve, reject) => {
        const url = input;
        const method = (init?.method || 'GET').toUpperCase();
        const headers = init?.headers || {};
        const body = init?.body;

        wx.request({
          url,
          method: method as any,
          header: headers instanceof (globalThis as any).Headers
            ? Object.fromEntries(headers.entries())
            : headers,
          data: body ? (typeof body === 'string' ? body : JSON.parse(body)) : undefined,
          success(res: any) {
            const respHeaders = new (globalThis as any).Headers();
            if (res.header) {
              Object.keys(res.header).forEach(k => {
                respHeaders.set(k, res.header[k]);
              });
            }
            resolve(new (globalThis as any).Response(
              typeof res.data === 'string' ? res.data : JSON.stringify(res.data),
              { status: res.statusCode, headers: respHeaders }
            ));
          },
          fail(err: any) {
            reject(err);
          },
        });
      });
    };
  }
})();
