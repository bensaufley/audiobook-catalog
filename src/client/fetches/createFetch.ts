/* eslint-disable prefer-arrow-functions/prefer-arrow-functions */
import { Signal } from '@preact/signals';

import { currentUser } from '~client/signals/User';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type URL = `/api/${string}`;

export enum Needs {
  Query = 'query',
  Body = 'body',
}

export interface SuccessResponse<R> {
  result: 'success';
  data: R;
}

export interface ErrorResponse {
  result: 'error';
  error: string;
}

export type Response<R> = SuccessResponse<R> | ErrorResponse;

type Signalable<V> = V | Signal<V>;
type DeepSignalable<O> = O extends object ? { [K in keyof O]: DeepSignalable<O[K]> } : Signalable<O>;

const getValue = <V>(value: DeepSignalable<V>): V => {
  if (value instanceof Signal) {
    return getValue(value.peek());
  }
  if (typeof value === 'object') {
    if (!value) return value as V;

    if (Array.isArray(value)) return value.map(getValue) as V;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, getValue(v)])) as V;
  }
  return value as V;
};

export default function createFetch<R>(method: Method, url: URL): () => Promise<Response<R>>; // no options
export default function createFetch<Q, R = never>(
  method: Method,
  url: URL,
  needs: Needs.Query,
): (query: DeepSignalable<Q>) => Promise<Response<R>>; // query-only
export default function createFetch<B, R = never>(
  method: Method,
  url: URL,
  needs: Needs.Body,
): (body: DeepSignalable<B>) => Promise<Response<R>>; // body-only
export default function createFetch<P, R = never>(
  method: Method,
  url: (params: P) => URL,
): (params: P) => Promise<Response<R>>; // params-only
export default function createFetch<Q, B, R = never>(
  method: Method,
  url: URL,
  needs: [Needs.Query, Needs.Body],
): (query: DeepSignalable<Q>, body: DeepSignalable<B>) => Promise<Response<R>>; // query and body
export default function createFetch<Q, P, R = never>(
  method: Method,
  url: (params: P) => URL,
  needs: Needs.Query,
): (params: DeepSignalable<P>, query: DeepSignalable<Q>) => Promise<Response<R>>; // query and params
export default function createFetch<B, P, R = never>(
  method: Method,
  url: (params: P) => URL,
  needs: Needs.Body,
): (params: DeepSignalable<P>, body: DeepSignalable<B>) => Promise<Response<R>>; // body and params
export default function createFetch<Q, B, P, R = never>(
  method: Method,
  url: (params: P) => URL,
  needs: [Needs.Query, Needs.Body],
): (params: DeepSignalable<P>, query: DeepSignalable<Q>, body: DeepSignalable<B>) => Promise<Response<R>>; // query, body, and params
export default function createFetch<Q, B, P, R = never>(
  method: Method,
  url: URL | ((params: P) => URL),
  needs?: Needs.Query | Needs.Body | [Needs.Query, Needs.Body] | undefined,
): (
  ...args:
    | []
    | [DeepSignalable<Q>]
    | [DeepSignalable<B>]
    | [DeepSignalable<Q>, DeepSignalable<B>]
    | [DeepSignalable<P>, DeepSignalable<Q>]
    | [DeepSignalable<P>, DeepSignalable<B>]
    | [DeepSignalable<P>, DeepSignalable<B>, DeepSignalable<Q>]
) => Promise<Response<R>> {
  let controller: AbortController | undefined;

  return async (...args): Promise<Response<R>> => {
    if (controller) controller.abort();
    const c = new AbortController();
    controller = c;

    const argsCopy = [...args];
    let query: Q | null = null;
    let body: B | null = null;
    let params: P | null = null;

    if (typeof url === 'function') {
      params = getValue(argsCopy.shift() as DeepSignalable<P>);
    }
    if (needs === Needs.Query) {
      query = getValue((argsCopy as [DeepSignalable<Q>])[0]);
    } else if (needs === Needs.Body) {
      body = getValue((argsCopy as [DeepSignalable<B>])[0]);
    } else if (Array.isArray(needs)) {
      query = getValue(argsCopy[0] as DeepSignalable<Q>);
      body = getValue(argsCopy[1] as DeepSignalable<B>);
    }
    try {
      const resp = await fetch(
        (typeof url === 'function' ? url(params!) : url) + (query ? `?${new URLSearchParams(query).toString()}` : ''),
        {
          body: body ? JSON.stringify(body) : null,
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-audiobook-catalog-user': currentUser.peek()?.id ?? '',
          },
          signal: c.signal,
        },
      );

      if (!resp.ok) throw resp;

      const json = (await resp.json()) as R;
      return { result: 'success', data: json };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return { result: 'error', error: 'Request aborted' };

      let message = 'An unexpected error occurred';
      if (err instanceof Error) message = err.message;
      else if (err instanceof Response) message = err.statusText;

      return { result: 'error', error: message };
    }
  };
}
