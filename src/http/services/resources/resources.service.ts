import { BehaviorSubject, Observable, Subject, Subscriber } from 'rxjs';

import { apiEndpoint } from '../../../auth/auth.service';
import { toQueryString } from '../../../utilities/api.utilities';
import { timeout } from '../../../utilities/async.utilities';
import { parseLinkHeader } from '../../../utilities/general.utilities';
import { HashMap } from '../../../utilities/types.utilities';
import { HttpError } from '../../http.interfaces';
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
const _promises: { [key: string]: Promise<any> } = {};
/** Total number of items returned by the last basic index query */
let _total: number = 0;
/** Total number of items returned by the last index query */
let _last_total: number = 0;
/** URL to get the next page */
let _next: string = '';

export function cleanup() {
    for (const key in _promises) {
        if (_promises[key]) {
            delete _promises[key];
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
): Promise<T[]> {
    let cache = 1000;
    /* istanbul ignore else */
    if (query_params && query_params.cache) {
        cache = query_params.cache;
        delete query_params.cache;
    }
    const query_str = toQueryString(query_params);
    const key = `${path}|query|${query_str}`;
    /* istanbul ignore else */
    if (!_promises[key]) {
        _promises[key] = new Promise((resolve, reject) => {
            const url = `${apiEndpoint()}/${path}${query_str ? '?' + query_str : ''}`;
            let result: T[] = [];
            get(url).subscribe(
                (resp: HashMap) => {
                    result =
                        resp && resp instanceof Array
                            ? resp.map(i => fn(i))
                            : resp && !(resp instanceof Array) && resp.results
                            ? (resp.results as HashMap[]).map(i => process(i))
                            : [];
                },
                (e: any) => {
                    reject(e);
                    timeout(key, () => delete _promises[key], 1);
                },
                () => {
                    const headers = responseHeaders(url);
                    if (headers && headers['x-total-count']) {
                        const total_value = +(headers['x-total-count'] || 0);
                        if (
                            query_str.length < 2 ||
                            (query_str.length < 12 && query_str.indexOf('offset=') >= 0)
                        ) {
                            _total = total_value;
                        }
                        _last_total = total_value;
                    }
                    if (headers && headers.Link) {
                        const link_map = parseLinkHeader(headers.Link || '');
                        _next = link_map.next;
                    }
                    resolve(result);
                    timeout(key, () => delete _promises[key], cache);
                }
            );
        });
    }
    return _promises[key];
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
): Promise<T> {
    const query_str = toQueryString(query_params);
    const key = `${path}|show|${id}|${query_str}`;
    /* istanbul ignore else */
    if (!_promises[key]) {
        _promises[key] = new Promise<T>((resolve, reject) => {
            const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
            let result: T;
            get(url).subscribe(
                (d: HashMap) => (result = fn(d)),
                (e: HttpError) => {
                    reject(e);
                    delete _promises[key];
                },
                () => {
                    resolve(result);
                    timeout(key, () => delete _promises[key], 1000);
                }
            );
        });
    }
    return _promises[key];
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
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const query_str = toQueryString(query_params);
        const url = `${apiEndpoint()}/${path}${query_str ? '?' + query_str : ''}`;
        let result: T;
        post(url, form_data).subscribe(
            (d: HashMap) => {
                result = fn(d);
            },
            (e: HttpError) => {
                _promises.new_item = null as any;
                reject(e);
            },
            () => {
                _promises.new_item = null as any;
                resolve(result);
            }
        );
    });
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
): Promise<U> {
    const query_str = toQueryString(form_data);
    const key = `${path}|task|${id}|${task_name}|${query_str}`;
    /* istanbul ignore else */
    if (!_promises[key]) {
        _promises[key] = new Promise<U>((resolve, reject) => {
            const post_data = form_data;
            const url = `${apiEndpoint()}/${path}/${id}/${task_name}`;
            let result: any;
            const request =
                method === 'post' || method === 'put'
                    ? (method === 'post' ? post : put)(url, post_data)
                    : (method === 'get' ? get : del)(`${url}${query_str ? '?' + query_str : ''}`);
            request.subscribe(
                d => (result = d),
                e => {
                    reject(e);
                    delete _promises[key];
                },
                () => {
                    resolve(callback(result));
                    timeout(key, () => delete _promises[key], 1000);
                }
            );
        });
    }
    return _promises[key];
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
): Promise<T> {
    const key = `${path}|update|${id}`;
    /* istanbul ignore else */
    if (!_promises[key]) {
        _promises[key] = new Promise<T>((resolve, reject) => {
            const query_str = toQueryString(query_params);
            const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
            let result: T;
            (type === 'put' ? put : patch)(url, form_data).subscribe(
                (d: HashMap) => (result = fn(d)),
                (e: HttpError) => {
                    reject(e);
                    delete _promises[key];
                },
                () => {
                    resolve(result);
                    timeout(key, () => delete _promises[key], 10);
                }
            );
        });
    }
    return _promises[key];
}

/**
 * Make delete request for the given item
 * @param id ID of item
 */
export function remove(
    id: string,
    query_params: HashMap = {},
    path: string = 'resource'
): Promise<void> {
    const query_str = toQueryString(query_params);
    const key = `${path}|delete|${id}|${query_str}`;
    /* istanbul ignore else */
    if (!_promises[key]) {
        _promises[key] = new Promise<void>((resolve, reject) => {
            const url = `${apiEndpoint()}/${path}/${id}${query_str ? '?' + query_str : ''}`;
            del(url).subscribe(
                _ => null,
                (e: HttpError) => {
                    reject(e);
                    delete _promises[key];
                },
                () => {
                    resolve();
                    timeout(key, () => delete _promises[key], 10);
                }
            );
        });
    }
    return _promises[key];
}

function process(data: HashMap) {
    return data as any;
}
