import { from, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

import { convertPairStringToMap, log } from '../utilities/general';
import { HashMap } from '../utilities/types';
import { HttpVerb } from './interfaces';
import {
    MockHttpRequestHandler,
    MockHttpRequestHandlerOptions,
    MockHttpRequest,
} from './interfaces';

/**
 * @private
 */
const _handlers: HashMap<MockHttpRequestHandler> = {};

/**
 * Register handler for http endpoint
 * @param path URL to be handled
 * @param data Data associated with the results of the endpoint
 * @param method HTTP Verb to listen to
 * @param callback Callback for handling request to the given endpoint
 * @param handler_map Handler map to add the endpoint to. Defaults to the global handler map
 */
export function registerMockEndpoint<T>(
    handler_ops: MockHttpRequestHandlerOptions,
    handler_map: HashMap<MockHttpRequestHandler> = _handlers
) {
    deregisterMockEndpoint(handler_ops.method, handler_ops.path, handler_map);
    const key = `${handler_ops.method}|${handler_ops.path}`;
    const path_parts = handler_ops.path
        .replace(/(http|https):\/\/[a-zA-Z0-9.]*:?([0-9]*)?/g, '') // Remove URL origin
        .replace(/^\//, '')
        .split('/');
    const handler: MockHttpRequestHandler<T> = {
        ...handler_ops,
        path_parts,
        path_structure: path_parts.map((i: string) => (i[0] === ':' ? i.replace(':', '') : '')),
    };
    handler_map[key] = handler;
    log('HTTP(M)', `+ ${handler_ops.method} ${handler_ops.path}`);
}

/**
 * Remove registration of mock endpoint
 * @param method Http Verb
 * @param url URL of the endpoint being mocked
 * @param handler_map Handler map to remove the endpoint from. Defaults to the global handler map
 */
export function deregisterMockEndpoint(
    method: string,
    url: string,
    handler_map: HashMap<MockHttpRequestHandler> = _handlers
) {
    const key = `${method}|${url}`;
    if (handler_map[key]) {
        delete handler_map[key];
        log('HTTP(M)', `- ${method} ${url}`);
    }
}

/**
 * @private
 * Remove mapping of handlers for Mock Http requests
 * @param handler_map Handler map to clear. Defaults to the global handler map
 */
export function clearMockEndpoints(handler_map: HashMap<MockHttpRequestHandler> = _handlers) {
    for (const key in handler_map) {
        if (handler_map[key]) {
            delete handler_map[key];
        }
    }
}

/**
 * @private
 * Perform mock request for the given method and URL.
 * Returns `null` if no handler for URL and method
 * @param method Http Verb for request
 * @param url URL to perform request on
 * @param handler_map Handler map to query for the request handler.
 *  Defaults to the global handler map
 */
export function mockRequest<T>(
    method: HttpVerb,
    url: string,
    handler_map: HashMap<MockHttpRequestHandler> = _handlers
): Observable<T> | null {
    const handler = findRequestHandler(method, url, handler_map);
    if (handler) {
        const request = processRequest(url, handler);
        return onMockRequest(handler, request);
    }
    return null;
}

/**
 * @private
 * Find a request handler for the given URL and method
 * @param method HTTP verb for the request
 * @param url URL of the request
 * @param handler_map Handler map to clear. Defaults to the global handler map
 */
export function findRequestHandler(
    method: HttpVerb,
    url: string,
    handler_map: HashMap<MockHttpRequestHandler> = _handlers
): MockHttpRequestHandler | null {
    const path = url
        .replace(/(http|https)?:\/\/[a-zA-Z0-9.]*:?([0-9]*)?/g, '')
        .replace(/^\//, '')
        .split('?')[0];
    const route_parts = path.split('/');
    const method_handlers: MockHttpRequestHandler[] = Object.keys(handler_map).reduce<
        MockHttpRequestHandler[]
    >((l, i) => {
        if (i.indexOf(`${method}|`) === 0) {
            l.push(handler_map[i]);
        }
        return l;
    }, []);
    for (const handler of method_handlers) {
        if (handler.path_structure.length === route_parts.length) {
            // Path lengths match
            let match = true;
            for (let i = 0; i < handler.path_structure.length; i++) {
                if (!handler.path_structure[i] && handler.path_parts[i] !== route_parts[i]) {
                    // Static path fragments don't match
                    match = false;
                    break;
                }
            }
            if (match) {
                return handler;
            }
        }
    }
    return null;
}

/**
 * @private
 * Generate mock HTTP request from the given URL and handler
 * @param url URL to mock
 * @param handler Handler for the given URL
 */
export function processRequest<T = any>(
    url: string,
    handler: MockHttpRequestHandler<T>,
    body?: any
): MockHttpRequest {
    const parts = url.replace(/(http|https):\/\/[a-zA-Z0-9.]*:?([0-9]*)?/g, '').split('?');
    const path = parts[0].replace(/^\//g, '');
    const query = parts[1] || '';
    const query_params = convertPairStringToMap(query);
    // Grab route parameters from URL
    const route_parts = path.split('/');
    const route_params: HashMap = {};
    for (const part of handler.path_structure) {
        if (part) {
            route_params[part] = route_parts[handler.path_structure.indexOf(part)];
        }
    }
    const request = {
        url,
        path: handler.path,
        method: handler.method,
        metadata: handler.metadata,
        route_params,
        query_params,
        body,
    };
    log('HTTP(M)', `MATCHED ${request.method}:`, request);
    return request;
}

/**
 * @private
 * Perform request and return an observable for the generated response
 * @param handler Request handler
 * @param request Request contents
 */
export function onMockRequest(handler: MockHttpRequestHandler, request: MockHttpRequest) {
    const result = handler.callback ? handler.callback(request) : handler.metadata;
    const variance = handler.delay_variance || 100;
    const delay_value = handler.delay || 300;
    const delay_time = Math.floor(Math.random() * variance - variance / 2) + delay_value;
    log('HTTP(M)', `RESP ${request.method}:`, [request.url, result]);
    return from([result]).pipe(delay(Math.max(200, delay_time)));
}
