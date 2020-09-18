import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { apiEndpoint } from '../auth/functions';
import { toQueryString } from '../utilities/api';
import { parseLinkHeader, convertPairStringToMap } from '../utilities/general';
import { HashMap } from '../utilities/types';
import { del, get, patch, post, put, responseHeaders } from '../http/functions';

/** Total number of items returned by the last basic index query */
export function requestTotal(name: string): number {
    return _total[name] || 0;
}

/** Total number of items returned by the last basic index query */
export function lastRequestTotal(name: string): number {
    return _last_total[name] || 0;
}

/** URL for the next query page */
export function next(): string {
    return _next;
}
/**
 * @private
 * Map of promises for Service
 */
const _observables: HashMap<Observable<any>> = {};
/**
 * @private
 * Total number of items returned by the last basic index query
 */
let _total: HashMap<number> = {};
/**
 * @private
 * Total number of items returned by the last index query
 */
let _last_total: HashMap<number> = {};
/**
 * @private
 * URL to get the next page
 */
let _next: string = '';

/**
 * @private
 */
export function cleanupAPI() {
    for (const key in _observables) {
        if (_observables[key]) {
            delete _observables[key];
        }
    }
    _total = {};
    _last_total = {};
    _next = '';
}

export type QueryResponse<T> = Observable<{
    total: number;
    next: () => QueryResponse<T> | null;
    data: T[];
}>;

/**
 * @hidden
 * Query the index of the API route associated with this service
 * @param query_params Map of query paramaters to add to the request URL
 */
export function query<T>(
    query_params: HashMap = {},
    fn: (data: Partial<T>) => T = process,
    path: string = 'resource'
): QueryResponse<T> {
    const query_str = toQueryString(query_params);
    const url = `${apiEndpoint()}/${path}${query_str ? '?' + query_str : ''}`;
    return get(url).pipe(
        map((resp: HashMap) => {
            const details = handleHeaders(url, query_str, path);
            return {
                total: details.total || resp?.total,
                next: details.next ? () => query(details.next as Object, fn, path) : null,
                data:
                    resp && resp instanceof Array
                        ? resp.map((i) => fn(i))
                        : resp && !(resp instanceof Array) && resp.results
                        ? (resp.results as HashMap[]).map((i) => process(i))
                        : [],
            } as any;
        })
    );
}

/**
 * @hidden
 * Query the API route for a sepecific item
 * @param id ID of the item
 * @param query_params Map of query paramaters to add to the request URL
 */
export function show<T>(
    id: string,
    query_params: HashMap = {},
    fn: (data:  Partial<T>) => T = process,
    path: string = 'resource'
): Observable<T> {
    const query_str = toQueryString(query_params);
    const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
    return get(url).pipe(map((resp: any) => fn(resp)));
}

/**
 * @hidden
 * Make post request for a new item to the service
 * @param form_data Data to post to the server
 * @param query_params Map of query paramaters to add to the request URL
 */
export function create<T>(
    form_data:  Partial<T>,
    query_params: HashMap = {},
    fn: (data:  Partial<T>) => T = process,
    path: string = 'resource'
): Observable<T> {
    const query_str = toQueryString(query_params);
    const url = `${apiEndpoint()}/${path}${query_str ? '?' + query_str : ''}`;
    const observable = post(url, form_data).pipe(map((resp: any) => fn(resp)));
    return observable;
}

/**
 * @hidden
 * Perform API task for the given item ID
 * @param id ID of the item
 * @param task_name Name of the task
 * @param form_data Map of data to pass to the API
 * @param method Verb to use for request
 */
export function task<U = any>(
    id: string,
    task_name: string,
    form_data: any = {},
    method: 'post' | 'get' | 'del' | 'put' = 'post',
    callback: (_: any) => U = (_) => _,
    path: string = 'resource'
): Observable<U> {
    const query_str = toQueryString(form_data);
    const url = `${apiEndpoint()}/${path}/${id}/${task_name}`;
    const request =
        method === 'post' || method === 'put'
            ? (method === 'post' ? post : put)(url, form_data)
            : (method === 'get' ? get : del)(`${url}${query_str ? '?' + query_str : ''}`);
    return request.pipe(map((resp: HashMap) => callback(resp)));
}

/**
 * @hidden
 * Make put request for changes to the item with the given id
 * @param id ID of the item being updated
 * @param form_data New values for the item
 * @param query_params Map of query paramaters to add to the request URL
 */
export function update<T>(
    id: string,
    form_data: HashMap,
    query_params: HashMap = {},
    type: 'put' | 'patch' = 'patch',
    fn: (data: HashMap) => T = process,
    path: string = 'resource'
): Observable<T> {
    const query_str = toQueryString({ ...query_params, version: form_data.version || 0 });
    const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
    return (type === 'put' ? put : patch)(url, form_data).pipe(map((resp: HashMap) => fn(resp)));
}

/**
 * @hidden
 * Make delete request for the given item
 * @param id ID of item
 */
export function remove(
    id: string,
    query_params: HashMap = {},
    path: string = 'resource'
): Observable<any> {
    const query_str = toQueryString(query_params);
    const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
    return del(url);
}

/**
 * @private
 * @param url
 * @param query_str
 * @param name
 */
export function handleHeaders(url: string, query_str: string, name: string) {
    const headers = responseHeaders(url);
    const details: { total: number; next: HashMap<string> | null } = { total: 0, next: null };
    if (headers && headers['x-total-count']) {
        const total_value = +(headers['x-total-count'] || 0);
        if (query_str.length < 2 || (query_str.length < 12 && query_str.indexOf('offset=') >= 0)) {
            _total[name] = total_value;
        }
        _last_total[name] = total_value;
        details.total = total_value;
    }
    if (headers && headers.Link) {
        const link_map = parseLinkHeader(headers.Link || '');
        _next = link_map.next;
        details.next = convertPairStringToMap(_next.split('?')[1]);
    }
    return details;
}

function process(data: HashMap) {
    return data as any;
}
