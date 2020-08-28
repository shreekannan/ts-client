import { Observable, throwError, of } from 'rxjs';
import { switchMap, retryWhen, mergeMap, filter, take } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

import {
    invalidateToken,
    isMock,
    refreshAuthority,
    token,
    listenForToken,
} from '../auth/functions';
import { log } from '../utilities/general';
import { HashMap } from '../utilities/types';
import {
    HttpJsonOptions,
    HttpOptions,
    HttpResponse,
    HttpResponseType,
    HttpTextOptions,
    HttpVerb,
    HttpVoidOptions,
} from './interfaces';
import { mockRequest } from './mock';

/**
 * Method store to allow attaching spies for testing
 * @hidden
 */
export const engine_http: any = { log };

/**
 * @private
 * Map of headers from the last request made
 */
const _response_headers: HashMap<HashMap<string>> = {};

export function responseHeaders(
    url: string,
    /* istanbul ignore next */
    headers: HashMap<HashMap<string>> = _response_headers
): HashMap<string> {
    return headers[url] || {};
}

/**
 * Perform AJAX HTTP GET request
 * @param url URL of the GET endpoint
 * @param options Options to add to the request
 */
export function get(url: string, options?: HttpJsonOptions): Observable<HashMap>;
export function get(url: string, options?: HttpTextOptions): Observable<string>;
export function get(
    url: string,
    options?: HttpOptions,
    handler: (m: HttpVerb, url: string, opts: HttpOptions) => Observable<HttpResponse> = request
): Observable<HttpResponse> {
    /* istanbul ignore else */
    if (!options) {
        options = { response_type: 'json' };
    }
    return handler('GET', url, { response_type: 'json', ...options });
}

/**
 * Perform AJAX HTTP POST request
 * @param url URL of the POST endpoint
 * @param body Body contents of the request
 * @param options Options to add to the request
 */
export function post(url: string, body: any, options?: HttpJsonOptions): Observable<HashMap>;
export function post(url: string, body: any, options?: HttpTextOptions): Observable<string>;
export function post(
    url: string,
    body: any,
    options?: HttpOptions,
    handler: (m: HttpVerb, url: string, opts: HttpOptions) => Observable<HttpResponse> = request
): Observable<HttpResponse> {
    /* istanbul ignore else */
    if (!options) {
        options = { response_type: 'json' };
    }
    return handler('POST', url, { body, response_type: 'json', ...options });
}

/**
 * Perform AJAX HTTP PUT request
 * @param url URL of the PUT endpoint
 * @param body Body contents of the request
 * @param options Options to add to the request
 */
export function put(url: string, body: any, options?: HttpJsonOptions): Observable<HashMap>;
export function put(url: string, body: any, options?: HttpTextOptions): Observable<string>;
export function put(
    url: string,
    body: any,
    options?: HttpOptions,
    handler: (m: HttpVerb, url: string, opts: HttpOptions) => Observable<HttpResponse> = request
): Observable<HttpResponse> {
    /* istanbul ignore else */
    if (!options) {
        options = { response_type: 'json' };
    }
    return handler('PUT', url, { body, response_type: 'json', ...options });
}

/**
 * Perform AJAX HTTP PATCH request
 * @param url URL of the PATCH endpoint
 * @param body Body contents of the request
 * @param options Options to add to the request
 */
export function patch(url: string, body: any, options?: HttpJsonOptions): Observable<HashMap>;
export function patch(url: string, body: any, options?: HttpTextOptions): Observable<string>;
export function patch(
    url: string,
    body: any,
    options?: HttpOptions,
    handler: (m: HttpVerb, url: string, opts: HttpOptions) => Observable<HttpResponse> = request
): Observable<HttpResponse> {
    /* istanbul ignore else */
    if (!options) {
        options = { response_type: 'json' };
    }
    return handler('PATCH', url, { body, response_type: 'json', ...options });
}

/**
 * Perform AJAX HTTP DELETE request
 * @param url URL of the DELETE endpoint
 * @param options Options to add to the request
 */
export function del(url: string, options?: HttpJsonOptions): Observable<HashMap>;
export function del(url: string, options?: HttpTextOptions): Observable<string>;
export function del(url: string, options?: HttpVoidOptions): Observable<void>;
export function del(
    url: string,
    options?: HttpOptions,
    handler: (m: HttpVerb, url: string, opts: HttpOptions) => Observable<HttpResponse> = request
): Observable<HttpResponse> {
    /* istanbul ignore else */
    if (!options) {
        options = { response_type: 'void' };
    }
    return handler('DELETE', url, { response_type: 'void', ...options });
}

/**
 * @private
 * Convert response into the format requested
 * @param response Request response contents
 * @param type Type of data to return
 */
export async function transform(
    resp: Response,
    type: HttpResponseType,
    headers: HashMap<HashMap<string>> = _response_headers
): Promise<HttpResponse> {
    /* istanbul ignore else */
    if (resp.headers) {
        const map: HashMap<string> = {};
        if (resp.headers.forEach) {
            resp.headers.forEach((v, k) => (map[k] = v));
        } else {
            Object.keys(resp.headers).forEach((k) => (map[k] = (resp as any).headers[k]));
        }
        headers[resp.url || ''] = map;
    }
    switch (type) {
        case 'json':
            return await resp.json().catch(() => ({}));
        case 'text':
            return resp.text();
    }
}

/**
 * @private
 */
const reloadAuth = () => {
    invalidateToken();
    refreshAuthority().then(
        () => null,
        () => setTimeout(() => reloadAuth(), 1000)
    );
};

/**
 * @private
 * Perform fetch request
 * @param method Request verb. `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`
 * @param url URL of the request endpoint
 * @param options Options to add to the request
 */
export function request(
    method: HttpVerb,
    url: string,
    options: HttpOptions,
    is_mock: () => boolean = isMock,
    mock_handler: (m: HttpVerb, url: string) => Observable<HttpResponse> | null = mockRequest,
    success: (e: Response, t: HttpResponseType) => Promise<HttpResponse> = transform
): Observable<HttpResponse> {
    if (is_mock()) {
        const request_obs = mock_handler(method, url);
        if (request_obs) {
            return request_obs;
        }
    }
    options.headers = options.headers || {};
    options.headers['Content-Type'] = `application/json`;
    return listenForToken().pipe(
        filter((_) => _),
        take(1),
        switchMap((_) => {
            options.headers!.Authorization = `Bearer ${token()}`;
            return fromFetch(url, {
                ...options,
                body: JSON.stringify(options.body),
                method,
                credentials: 'same-origin',
            });
        }),
        switchMap((resp) => {
            if (resp.ok) {
                return success(resp, options.response_type as any);
            }
            return throwError(resp);
        }),
        retryWhen((attempts: Observable<any>) =>
            attempts.pipe(
                mergeMap((error, i) => {
                    if (i + 1 > 4 || error.status !== 401) {
                        return throwError(error || {});
                    }
                    reloadAuth();
                    return of(error);
                })
            )
        )
    );
}
