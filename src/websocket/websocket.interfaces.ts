
/** Commands allowed by Engine */
export type EngineCommand = 'bind' | 'unbind' | 'debug' | 'ignore' | 'exec';

/** General Engine websocket request metadata */
export interface EngineCommandRequest {
    /** Unique request identifier */
    id: string | number;
    /** Type of the command to send to engine */
    cmd: EngineCommand;
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

/** Additional management metadata for a Engine request */
export interface EngineCommandRequestMetadata extends EngineCommandRequest {
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
export interface EngineRequestOptions {
    /** System ID to perform the command  */
    sys: string;
    /** Module on the given system to perform the command */
    mod: string;
    /** Index of the module in the system */
    index: number;
    /** Name of variable to `bind` or method to `exec` on the given module */
    name: string;
}

/** Engine websocket exec request metadata */
export interface EngineExecRequestOptions extends EngineRequestOptions {
    args?: any[];
}

/** Websocket initialisation options */
export interface EngineWebsocketOptions {
    /** Domain and port of the engine server */
    host?: string;
    /** Whether this endpoint is a fixed device */
    fixed?: boolean;
    /** Whether to use the secure communcations protocol */
    secure?: boolean;
}

/** Engine webscoket API response */
export interface EngineResponse {
    /** ID of the associated request */
    id: string | number;
    /** Response type */
    type: 'success' | 'error' | 'notify' | 'debug';
    /** Error code */
    code?: number;
    /** New value of binding if `notify` or return value from an `exec */
    value?: any;
    /** Request metadata */
    meta?: EngineRequestOptions;
    /** Debug module */
    mod?: string;
    /** Debug module */
    klass?: string;
    /** Log message level */
    level?: EngineLogLevel;
    /** Debug message */
    msg?: string;
}

/** Possible error codes returned by Engine */
export enum EngineErrorCodes {
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
export enum EngineLogLevel {
    Info = 'info',
    Debug = 'debug',
    Warning = 'warn',
    Error = 'error'
}

/** Metadata associated with Engine Debug events */
export interface EngineDebugEvent {
    /** ID of the module associated with the event */
    mod_id: string;
    /** Module associated with the event */
    module: string;
    /** Logically class name of the module driver */
    class_name: string;
    /** Logging level of the message */
    level: EngineLogLevel;
    /** Contents of the debug event */
    message: string;
}
