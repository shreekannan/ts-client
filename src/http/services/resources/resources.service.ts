import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { apiEndpoint } from '../../../auth/auth.service';
import { toQueryString } from '../../../utilities/api.utilities';
import { timeout } from '../../../utilities/async.utilities';
import { parseLinkHeader } from '../../../utilities/general.utilities';
import { HashMap } from '../../../utilities/types.utilities';
import { del, get, patch, post, put, responseHeaders } from '../../http.service';

/** Total number of items returned by the last basic index query */
export function total(): number {
    return _total;
}

/** Total number of items returned by the last basic index query */
export function last_total(): number {
    return _last_total;
}

/** URL for the next query page */
export function next(): string {
    return _next;
}
/** Map of promises for Service */
const _obserables: { [key: string]: Observable<any> } = {};
/** Total number of items returned by the last basic index query */
let _total: number = 0;
/** Total number of items returned by the last index query */
let _last_total: number = 0;
/** URL to get the next page */
let _next: string = '';

export function cleanupAPI() {
    for (const key in _obserables) {
        if (_obserables[key]) {
            delete _obserables[key];
        }
    }
    _total = 0;
    _last_total = 0;
    _next = '';
}

/**
 * Query the index of the API route associated with this service
 * @param query_params Map of query paramaters to add to the request URL
 */
export function query<T>(
    query_params: HashMap = {},
    fn: (data: HashMap) => T = process,
    path: string = 'resource'
): Observable<T[]> {
    let cache = 1000;
    /* istanbul ignore else */
    if (query_params && query_params.cache) {
        cache = query_params.cache;
        delete query_params.cache;
    }
    const query_str = toQueryString(query_params);
    const key = `${path}|query|${query_str}`;
    /* istanbul ignore else */
    if (!_obserables[key]) {
        const url = `${apiEndpoint()}/${path}${query_str ? '?' + query_str : ''}`;
        _obserables[key] = get(url).pipe(
            map((resp: HashMap) => {
                handleHeaders(url, query_str);
                return resp && resp instanceof Array
                    ? resp.map(i => fn(i))
                    : resp && !(resp instanceof Array) && resp.results
                    ? (resp.results as HashMap[]).map(i => process(i))
                    : [];
            })
        );
        _obserables[key].toPromise().then(
            () => timeout(key, () => delete _obserables[key], cache),
            () => timeout(key, () => delete _obserables[key], 1)
        );
    }
    return _obserables[key];
}

/**
 * Query the API route for a sepecific item
 * @param id ID of the item
 * @param query_params Map of query paramaters to add to the request URL
 */
export function show<T>(
    id: string,
    query_params: HashMap = {},
    fn: (data: HashMap) => T = process,
    path: string = 'resource'
): Observable<T> {
    const query_str = toQueryString(query_params);
    const key = `${path}|show|${id}|${query_str}`;
    /* istanbul ignore else */
    if (!_obserables[key]) {
        const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
        _obserables[key] = get(url).pipe(map((resp: HashMap) => fn(resp)));
        _obserables[key].toPromise().then(
            () => timeout(key, () => delete _obserables[key], 500),
            () => timeout(key, () => delete _obserables[key], 1)
        );
    }
    return _obserables[key];
}

/**
 * Make post request for a new item to the service
 * @param form_data Data to post to the server
 * @param query_params Map of query paramaters to add to the request URL
 */
export function create<T>(
    form_data: HashMap,
    query_params: HashMap = {},
    fn: (data: HashMap) => T = process,
    path: string = 'resource'
): Observable<T> {
    const query_str = toQueryString(query_params);
    const url = `${apiEndpoint()}/${path}${query_str ? '?' + query_str : ''}`;
    const observable = post(url, form_data).pipe(map((resp: HashMap) => fn(resp)));
    return observable;
}

/**
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
    callback: (_: any) => U = _ => _,
    path: string = 'resource'
): Observable<U> {
    const query_str = toQueryString(form_data);
    const key = `${path}|task|${id}|${task_name}|${query_str}`;
    /* istanbul ignore else */
    if (!_obserables[key]) {
        const post_data = form_data;
        const url = `${apiEndpoint()}/${path}/${id}/${task_name}`;
        const request =
            method === 'post' || method === 'put'
                ? (method === 'post' ? post : put)(url, post_data)
                : (method === 'get' ? get : del)(`${url}${query_str ? '?' + query_str : ''}`);
        _obserables[key] = request.pipe(map((resp: HashMap) => callback(resp)));
        _obserables[key].toPromise().then(
            () => timeout(key, () => delete _obserables[key], 500),
            () => timeout(key, () => delete _obserables[key], 1)
        );
    }
    return _obserables[key];
}

/**
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
    const key = `${path}|update|${id}`;
    /* istanbul ignore else */
    if (!_obserables[key]) {
        const query_str = toQueryString(query_params);
        const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
        _obserables[key] = (type === 'put' ? put : patch)(url, form_data).pipe(
            map((resp: HashMap) => fn(resp))
        );
        _obserables[key].toPromise().then(
            () => timeout(key, () => delete _obserables[key], 500),
            () => timeout(key, () => delete _obserables[key], 1)
        );
    }
    return _obserables[key];
}

/**
 * Make delete request for the given item
 * @param id ID of item
 */
export function remove(
    id: string,
    query_params: HashMap = {},
    path: string = 'resource'
): Observable<void> {
    const query_str = toQueryString(query_params);
    const key = `${path}|delete|${id}|${query_str}`;
    /* istanbul ignore else */
    if (!_obserables[key]) {
        const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
        _obserables[key] = del(url);
        _obserables[key].toPromise().then(
            () => delete _obserables[key],
            () => delete _obserables[key]
        );
    }
    return _obserables[key];
}

function handleHeaders(url: string, query_str: string) {
    const headers = responseHeaders(url);
    if (headers && headers['x-total-count']) {
        const total_value = +(headers['x-total-count'] || 0);
        if (query_str.length < 2 || (query_str.length < 12 && query_str.indexOf('offset=') >= 0)) {
            _total = total_value;
        }
        _last_total = total_value;
    }
    if (headers && headers.Link) {
        const link_map = parseLinkHeader(headers.Link || '');
        _next = link_map.next;
    }
}

function process(data: HashMap) {
    return data as any;
}
