
/** Commands allowed by Place */
export type PlaceCommand = 'bind' | 'unbind' | 'debug' | 'ignore' | 'exec';

/** General Place websocket request metadata */
export interface PlaceCommandRequest {
    /** Unique request identifier */
    id: string | number;
    /** Type of the command to send to engine */
    cmd: PlaceCommand;
    /** System ID to perform the command  */
    sys: string;
    /** Module on the given system to perform the command */
    mod: string;
    /** Index of the module in the system */
    index: number;
    /** Name of variable to `bind` or method to `exec` on the given module */
    name: string;
    /** Aruguments to pass to the method executed on the module */
    args?: any[];
}

/** Additional management metadata for a Place request */
export interface PlaceCommandRequestMetadata extends PlaceCommandRequest {
    /** Request and binding identifier */
    key: string;
    /** Request promise */
    promise?: Promise<any>;
    /** Resolve function for the request promise */
    resolve?: (_?: any) => void;
    /** Reject function for the request promise */
    reject?: (_?: any) => void;
}

/** Metadata describing the actor the request should be performed on */
export interface PlaceRequestOptions {
    /** System ID to perform the command  */
    sys: string;
    /** Module on the given system to perform the command */
    mod: string;
    /** Index of the module in the system */
    index: number;
    /** Name of variable to `bind` or method to `exec` on the given module */
    name: string;
}

/** Place websocket exec request metadata */
export interface PlaceExecRequestOptions extends PlaceRequestOptions {
    args?: any[];
}

/** Websocket initialisation options */
export interface PlaceWebsocketOptions {
    /** Domain and port of the engine server */
    host?: string;
    /** Whether this endpoint is a fixed device */
    fixed?: boolean;
    /** Whether to use the secure communcations protocol */
    secure?: boolean;
}

/** Place webscoket API response */
export interface PlaceResponse {
    /** ID of the associated request */
    id: string | number;
    /** Response type */
    type: 'success' | 'error' | 'notify' | 'debug';
    /** Error code */
    code?: number;
    /** New value of binding if `notify` or return value from an `exec */
    value?: any;
    /** Request metadata */
    meta?: PlaceRequestOptions;
    /** Debug module */
    mod?: string;
    /** Debug module */
    klass?: string;
    /** Log message level */
    level?: PlaceLogLevel;
    /** Debug message */
    msg?: string;
}

/** Possible error codes returned by Place */
export enum PlaceErrorCodes {
    PARSE_ERROR = 0,
    BAD_REQUEST = 1,
    ACCESS_DENIED = 2,
    REQUEST_FAILED = 3,
    UNKNOWN_CMD = 4,
    SYS_NOT_FOUND = 5,
    MOD_NOT_FOUND = 6,
    UNEXPECTED_FAILURE = 7
}

/** Simple interface for a network error response */
export interface SimpleNetworkError {
    /** Status code of the error */
    status: number;
    /** Details aboun the error */
    message: string;
}

/** Logging levels of debug messages */
export enum PlaceLogLevel {
    Info = 'info',
    Debug = 'debug',
    Warning = 'warn',
    Error = 'error',
    Fatal = 'fatal'
}

/** Metadata associated with Place Debug events */
export interface PlaceDebugEvent {
    /** ID of the module associated with the event */
    mod_id: string;
    /** Module associated with the event */
    module: string;
    /** Logically class name of the module driver */
    class_name: string;
    /** Logging level of the message */
    level: PlaceLogLevel;
    /** Contents of the debug event */
    message: string;
    /** Unix epoch of the message arrival in seconds */
    time: number;
}
