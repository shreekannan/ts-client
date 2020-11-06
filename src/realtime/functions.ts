import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import {
    apiEndpoint,
    authority,
    host,
    httpRoute,
    invalidateToken,
    isFixedDevice,
    isMock,
    isSecure,
    needsTokenHeader,
    refreshAuthority,
    token,
} from '../auth/functions';
import { is_iOS, log } from '../utilities/general';
import { HashMap } from '../utilities/types';
import {
    PlaceCommandRequest,
    PlaceCommandRequestMetadata,
    PlaceDebugEvent,
    PlaceErrorCodes,
    PlaceExecRequestOptions,
    PlaceLogLevel,
    PlaceRequestOptions,
    PlaceResponse,
    SimpleNetworkError,
} from './interfaces';
import { mockSystem } from './mock';
import { MockPlaceWebsocketModule } from './mock-module';
import { MockPlaceWebsocketSystem } from './mock-system';

/**
 * @private
 * Time in seconds to ping the server to keep the websocket connection alive
 */
const KEEP_ALIVE = 20;
/**
 * @private
 * Global counter for websocket request IDs
 */
let REQUEST_COUNT = 0;
/**
 * @private
 * Websocket for connecting to engine
 */
let _websocket: WebSocketSubject<any> | Subject<any> | undefined;
/**
 * @private
 * Request promises
 */
const _requests: { [id: string]: PlaceCommandRequestMetadata } = {};
/**
 * @private
 * Subjects for listening to values of bindings
 */
const _binding: { [id: string]: BehaviorSubject<any> } = {};
/**
 * @private
 * Observers for the binding subjects
 */
const _observers: { [id: string]: Observable<any> } = {};
/**
 * @private
 * Observers for the binding subjects
 */
const _listeners: { [id: string]: Subscription } = {};
/**
 * @private
 * BehaviorSubject holding the connection status of the websocket
 */
const _status = new BehaviorSubject<boolean>(false);
_observers._place_os_status = _status.asObservable();
/**
 * @private
 * Interval ID for the server ping callback
 */
let _keep_alive: number | undefined;
/**
 * @private
 * Number of connection attempts made before the session is established
 */
let _connection_attempts: number = 0;
/**
 * @private
 * Promise to handle connections to the websocket API
 */
let _connection_promise: Promise<void> | null = null;
/**
 * @private
 * Timer to check the initial health of the websocket connection
 */
let _health_check: number | undefined;

/** Listener for debugging events */
export const debug_events = new Subject<PlaceDebugEvent>();
_observers._place_os_debug_events = debug_events.asObservable();

/* istanbul ignore next */
/**
 * @private
 */
export function cleanupRealtime() {
    _websocket?.complete();
    _websocket = undefined;
    REQUEST_COUNT = 0;
    for (const key in _binding) {
        if (_binding[key]) {
            delete _binding[key];
        }
    }
    for (const key in _observers) {
        if (_observers[key]) {
            delete _observers[key];
        }
    }
    _observers._place_os_status = _status.asObservable();
    for (const key in _listeners) {
        if (_listeners[key]) {
            delete _listeners[key];
        }
    }
    for (const key in _requests) {
        if (_requests[key]) {
            delete _requests[key];
        }
    }
    _status.next(false);
    clearInterval(_keep_alive);
    clearTimeout(_health_check);
}

export function websocketRoute() {
    return apiEndpoint().indexOf('control') >= 0
        ? '/control/websocket'
        : `${httpRoute()}/systems/control`;
}

/** Whether the websocket is connected */
export function isConnected(): boolean {
    return _status.getValue();
}

/**
 * Listen to websocket status changes
 */
export function status(): Observable<boolean> {
    return _observers._place_os_status;
}

/**
 * Listen to binding changes on the given status variable. DOES NOT BIND TO VARIABLE
 * @param binding_details Binding details
 */
export function listen<T = any>(binding_details: PlaceRequestOptions): Observable<T>;
export function listen<T = any>(
    binding_details: PlaceRequestOptions,
    bindings: HashMap<BehaviorSubject<T>> = _binding,
    observers: HashMap<Observable<T>> = _observers
): Observable<T> {
    const key = `${binding_details.sys}|${binding_details.mod}_${binding_details.index}|${binding_details.name}`;
    /* istanbul ignore else */
    if (!bindings[key]) {
        bindings[key] = new BehaviorSubject<T>(null as any);
        observers[key] = bindings[key].asObservable();
    }
    return observers[key];
}

/**
 * Get current binding value
 * @param options Binding details
 */
export function value<T = any>(options: PlaceRequestOptions): T | undefined;
export function value<T = any>(
    options: PlaceRequestOptions,
    bindings: HashMap<BehaviorSubject<T>> = _binding
): T | void {
    const key = `${options.sys}|${options.mod}_${options.index}|${options.name}`;
    if (bindings[key]) {
        return bindings[key].getValue() as T;
    }
    return;
}

/**
 * Bind to status variable on the given system module
 * @param options Binding request options
 */
export function bind(options: PlaceRequestOptions): Promise<void>;
export function bind(
    options: PlaceRequestOptions,
    post: (_: PlaceCommandRequest) => Promise<void> = send
): Promise<void> {
    const request: PlaceCommandRequest = {
        id: ++REQUEST_COUNT,
        cmd: 'bind',
        ...options,
    };
    return post(request);
}

/**
 * Unbind from a status variable on the given system module
 * @param options Unbind request options
 */
export function unbind(options: PlaceRequestOptions): Promise<void>;
export function unbind(
    options: PlaceRequestOptions,
    post: (_: PlaceCommandRequest) => Promise<void> = send
): Promise<void> {
    const request: PlaceCommandRequest = {
        id: ++REQUEST_COUNT,
        cmd: 'unbind',
        ...options,
    };
    return post(request);
}

/**
 * Execute method on the given system module
 * @param options Exec request options
 */
export function execute(options: PlaceExecRequestOptions): Promise<void>;
export function execute<T = any>(
    options: PlaceExecRequestOptions,
    post: (_: PlaceCommandRequest) => Promise<T> = send
): Promise<T> {
    const request: PlaceCommandRequest = {
        id: ++REQUEST_COUNT,
        cmd: 'exec',
        ...options,
    };
    return post(request);
}

/**
 * Listen to debug logging for on the given system module binding
 * @param options Debug request options
 */
export function debug(options: PlaceRequestOptions): Promise<void>;
export function debug(
    options: PlaceRequestOptions,
    post: (_: PlaceCommandRequest) => Promise<void> = send
): Promise<void> {
    const request: PlaceCommandRequest = {
        id: ++REQUEST_COUNT,
        cmd: 'debug',
        ...options,
    };
    return post(request);
}

/**
 * Stop debug logging on the given system module binding
 * @param options Debug request options
 */
export function ignore(options: PlaceRequestOptions): Promise<void>;
export function ignore(
    options: PlaceRequestOptions,
    post: (_: PlaceCommandRequest) => Promise<void> = send
): Promise<void> {
    const request: PlaceCommandRequest = {
        id: ++REQUEST_COUNT,
        cmd: 'ignore',
        ...options,
    };
    return post(request);
}

/**
 * @private
 * Send request to engine through the websocket connection
 * @param request New request to post to the server
 */
export function send<T = any>(request: PlaceCommandRequest, tries: number = 0): Promise<T> {
    const key = `${request.cmd}|${request.sys}|${request.mod}${request.index}|${request.name}|${request.args}`;
    /* istanbul ignore else */
    if (!_requests[key]) {
        const req: PlaceCommandRequestMetadata = { ...request, key };
        req.promise = new Promise((resolve, reject) => {
            const retry = () => {
                delete _requests[key];
                (_requests[key] as any) = null;
                send(request, tries).then(
                    (_) => resolve(_),
                    (_) => reject(_)
                );
            };
            if (_websocket && isConnected()) {
                if (isMock()) {
                    handleMockSend(request, _websocket, _listeners);
                }
                req.resolve = resolve;
                req.reject = reject;
                const binding = `${request.sys}, ${request.mod}_${request.index}, ${request.name}`;
                log('WS', `[${request.cmd.toUpperCase()}](${request.id}) ${binding}`, request.args);
                _websocket.next(request);
            } else if (!_connection_promise) {
                connect().then(() => retry());
            } else {
                setTimeout(() => retry(), 1000);
            }
        });
        _requests[key] = req;
    }
    return _requests[key].promise as Promise<any>;
}

/**
 * @private
 * Callback for messages from the server
 * @param message Message from the engine server
 */
export function onMessage(message: PlaceResponse | 'pong'): void {
    if (message !== 'pong' && message instanceof Object) {
        if (message.type === 'notify' && message.meta) {
            let updated_value = message.value;
            try {
                updated_value = JSON.parse(message.value);
            } catch (e) {
                log('WS', '[ERROR] Unable to parse JSON in notify value');
            }
            handleNotify(message.meta, updated_value);
        } else if (message.type === 'success') {
            handleSuccess(message);
        } else if (message.type === 'debug') {
            log('WS', `[DEBUG] ${message.mod}${message.klass} →`, message.msg);
            const meta = message.meta || { mod: '', index: '' };
            debug_events.next({
                mod_id: message.mod || '<empty>',
                module: `${meta.mod}_${meta.index}`,
                class_name: message.klass || '<empty>',
                message: message.msg || '<empty>',
                level: message.level || PlaceLogLevel.Debug,
                time: Math.floor(new Date().getTime() / 1000),
            });
        } else if (message.type === 'error') {
            handleError(message);
        } else if (!(message as any).cmd) {
            // Not mock message
            log('WS', 'Invalid websocket message', message, 'error');
        }
    }
}

/**
 * @private
 * Handle websocket success response
 * @param message Success message
 */
export function handleSuccess(message: PlaceResponse) {
    const request = Object.keys(_requests)
        .map((i) => _requests[i])
        .find((i) => i.id === message.id);
    log('WS', `[SUCCESS](${message.id})`);
    /* istanbul ignore else */
    if (request && request.resolve) {
        request.resolve(message.value);
        delete _requests[request.key];
    }
}

/**
 * @private
 * Handle websocket request error
 * @param message Error response
 */
export function handleError(message: PlaceResponse) {
    let type = 'UNEXPECTED FAILURE';
    switch (message.code) {
        case PlaceErrorCodes.ACCESS_DENIED:
            type = 'ACCESS DENIED';
            break;
        case PlaceErrorCodes.BAD_REQUEST:
            type = 'BAD REQUEST';
            break;
        case PlaceErrorCodes.MOD_NOT_FOUND:
            type = 'MODULE NOT FOUND';
            break;
        case PlaceErrorCodes.SYS_NOT_FOUND:
            type = 'SYSTEM NOT FOUND';
            break;
        case PlaceErrorCodes.PARSE_ERROR:
            type = 'PARSE ERROR';
            break;
        case PlaceErrorCodes.REQUEST_FAILED:
            type = 'REQUEST FAILED';
            break;
        case PlaceErrorCodes.UNKNOWN_CMD:
            type = 'UNKNOWN COMMAND';
            break;
    }
    log('WS', `[ERROR] ${type}(${message.id}): ${message.msg}`, undefined, 'error');
    const request = Object.keys(_requests)
        .map((i) => _requests[i])
        .find((i) => i.id === message.id);
    if (request && request.reject) {
        request.reject(message);
        delete _requests[request.key];
    }
}

/**
 * @private
 * Update the current value of the binding
 * @param options Binding details
 * @param updated_value New binding value
 */
export function handleNotify<T = any>(
    options: PlaceRequestOptions,
    updated_value: T,
    bindings: HashMap<BehaviorSubject<T>> = _binding,
    observers: HashMap<Observable<T>> = _observers
): void {
    const key = `${options.sys}|${options.mod}_${options.index}|${options.name}`;
    if (!bindings[key]) {
        bindings[key] = new BehaviorSubject<T>(null as any);
        observers[key] = bindings[key].asObservable();
    }
    const binding = `${options.sys}, ${options.mod}_${options.index}, ${options.name}`;
    log('WS', `[NOTIFY] ${binding} changed`, [bindings[key].getValue(), '→', updated_value]);
    bindings[key].next(updated_value);
}

/**
 * @private
 * Connect to engine websocket
 */
export function connect(tries: number = 0): Promise<void> {
    if (_connection_promise == null) {
        _connection_promise = new Promise<void>((resolve) => {
            if (tries > 40) {
                return location.reload();
            }
            _connection_attempts++;
            _websocket = isMock() ? createMockWebSocket() : createWebsocket();
            if (_websocket && (token() || isMock()) && authority()) {
                log('WS', `Connecting to websocket...`);
                _websocket.subscribe(
                    (resp: PlaceResponse) => {
                        if (!_status.getValue()) {
                            log('WS', `Connection established.`);
                            resolve();
                        }
                        _status.next(true);
                        _connection_attempts = 0;
                        clearHealthCheck();
                        onMessage(resp);
                    },
                    (err: SimpleNetworkError) => {
                        _websocket = undefined;
                        _connection_promise = null;
                        clearHealthCheck();
                        onWebSocketError(err);
                    },
                    () => {
                        _websocket = undefined;
                        _connection_promise = null;
                        _status.next(false);
                    }
                );
                if (_keep_alive) {
                    clearInterval(_keep_alive);
                }
                ping();
                _keep_alive = setInterval(() => ping(), KEEP_ALIVE * 1000) as any;
                clearHealthCheck();
                _health_check = setTimeout(() => {
                    log('WS', 'Unhealthy connection. Reconnecting...');
                    _status.next(false);
                    _connection_promise = null;
                    reconnect();
                }, 30 * 1000) as any;
            } else {
                /* istanbul ignore else */
                if (!_websocket) {
                    log('WS', `Failed to create websocket(${tries}). Retrying in ${1000 * Math.min(10, tries + 1)}ms...`, undefined, 'error');
                } else {
                    log('WS', `Waiting on auth(${tries}). Retrying in ${1000 * Math.min(10, tries + 1)}ms...`, [!!token(), !!authority()], 'info');
                }
                setTimeout(() => {
                    _connection_promise = null;
                    connect(tries).then(_ => resolve(_));
                }, 1000 * Math.min(10, ++tries));
            }
        });
    }
    return _connection_promise;
}

/**
 * @private
 * Create websocket connection
 */
export function createWebsocket() {
    const secure = isSecure() || location.protocol.indexOf('https') >= 0;
    let url = `ws${secure ? 's' : ''}://${host()}${websocketRoute()}${
        isFixedDevice() ? '?fixed_device=true' : ''
    }`;
    if (!needsTokenHeader() && !is_iOS()) {
        log('WS', `Authenticating through cookie...`);
        const cookie = `bearer_token=${token()};max-age=120;path=${httpRoute()};${
            secure ? 'secure;' : ''
        }samesite=strict`;
        document.cookie = cookie;
        log('WS', `Cookies:`, [document.cookie, cookie]);
    } else {
        log('WS', `Authenticating through URL query parameter...`);
        url += `${url.indexOf('?') >= 0 ? '&' : '?'}bearer_token=${token()}`;
    }
    log('WS', `Creating websocket connection to ws${secure ? 's' : ''}://${host()}${websocketRoute()}`);
    /* istanbul ignore next */
    return webSocket<any>({
        url,
        serializer: (data) => (typeof data === 'object' ? JSON.stringify(data) : data),
        deserializer: (data) => {
            let return_value = data.data;
            try {
                const obj = JSON.parse(data.data);
                return_value = obj;
            } catch (e) {
                return_value = return_value;
            }
            return return_value;
        },
    });
}

/**
 * @private
 * Close old websocket connect and open a new one
 */
export function reconnect() {
    /* istanbul ignore else */
    if (_websocket && isConnected()) {
        _websocket.complete();
        /* istanbul ignore else */
        if (_keep_alive) {
            clearInterval(_keep_alive);
            _keep_alive = undefined;
        }
    }
    log('WS', `Reconnecting in ${Math.min(5000, _connection_attempts * 300 || 1000)}ms...`);
    setTimeout(() => connect(), Math.min(5000, _connection_attempts * 300 || 1000));
}

/**
 * @private
 * Send ping through the websocket
 */
export function ping() {
    _websocket!.next('ping');
}

/**
 * @private
 * Handle errors on the websocket
 * @param err Network error response
 */
export function onWebSocketError(err: SimpleNetworkError) {
    _status.next(false);
    log('WS', 'Websocket error:', err, undefined, 'error');
    /* istanbul ignore else */
    if (err.status === 401) {
        invalidateToken();
    }
    refreshAuthority();
    // Try reconnecting after 1 second
    reconnect();
}

/**
 * @private
 * Clear health check timer
 */
export function clearHealthCheck() {
    if (_health_check) {
        clearTimeout(_health_check);
        _health_check = undefined;
    }
}

/**
 * @private
 * Connect to engine websocket
 */
export function createMockWebSocket() {
    const websocket = new Subject<PlaceResponse | PlaceCommandRequest>();
    websocket.subscribe((resp: PlaceResponse | PlaceCommandRequest) =>
        onMessage(resp as PlaceResponse)
    );
    return websocket;
}

/**
 * @private
 * Send request to engine through the websocket connection
 * @param request New request to post to the server
 */
export function handleMockSend(
    request: PlaceCommandRequest,
    websocket: Subject<any>,
    listeners: HashMap<Subscription>
) {
    const key = `${request.sys}|${request.mod}_${request.index}|${request.name}`;
    const system: MockPlaceWebsocketSystem = mockSystem(request.sys);
    const module: MockPlaceWebsocketModule =
        system && system[request.mod] ? system[request.mod][request.index - 1 || 0] : null;
    if (module) {
        switch (request.cmd) {
            case 'bind':
                listeners[key] = module.listen(request.name).subscribe((new_value) => {
                    setTimeout(
                        () => {
                            websocket.next({
                                type: 'notify',
                                value: new_value,
                                meta: request,
                            });
                        },
                        Math.floor(Math.random() * 100 + 50) // Add natural delay before response
                    );
                });
                break;
            case 'unbind':
                /* istanbul ignore else */
                if (listeners[key]) {
                    listeners[key].unsubscribe();
                    delete listeners[key];
                }
                break;
        }
        setTimeout(() => {
            const resp = {
                id: request.id,
                type: 'success',
                value: request.cmd === 'exec' ? module.call(request.name, request.args) : null,
            } as PlaceResponse;
            websocket.next(resp);
        }, 10);
    } else {
        // Error determining system or module
        setTimeout(
            () =>
                websocket.next({
                    id: request.id,
                    type: 'error',
                    code: system ? PlaceErrorCodes.SYS_NOT_FOUND : PlaceErrorCodes.MOD_NOT_FOUND,
                } as PlaceResponse),
            10
        );
    }
}
