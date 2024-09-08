/* eslint-disable prefer-arrow-functions/prefer-arrow-functions */
import { Signal } from '@preact/signals';

import { clearToast, Level, setError } from '~client/components/Toasts/utils';
import { isFastApiErrorResponse } from '~client/shared/errors';
import { currentUser } from '~client/signals/user';

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
    const uri =
      (typeof url === 'function' ? url(params!) : url) + (query ? `?${new URLSearchParams(query).toString()}` : '');
    const errorKey = `fetch-${method}-${uri}`;
    clearToast(errorKey, Level.Error);
    try {
      const resp = await fetch(uri, {
        body: body ? JSON.stringify(body) : null,
        method,
        headers: {
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...(currentUser.peek() ? { 'x-audiobook-catalog-user': currentUser.peek()!.id } : {}),
        },
        signal: c.signal,
      });

      if (!resp.ok) throw resp;

      if (resp.status === 204) {
        return { result: 'success', data: undefined as R };
      }

      const json = (await resp.json()) as R;
      return { result: 'success', data: json };
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return { result: 'error', error: 'Request aborted' };

      let message = 'An unexpected error occurred';
      if (err instanceof Error) message = err.message;
      else if (err instanceof Response) {
        try {
          const json = await err.json();
          if (isFastApiErrorResponse(json)) message = `${json.error}: ${json.message}`;
          else if ('detail' in json) message = json.detail;
        } catch {
          message = err.statusText;
        }
      }

      setError(message, errorKey, { selfDismiss: 10 });

      return { result: 'error', error: message };
    }
  };
}
