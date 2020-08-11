import { HashMap } from '../utilities/types';

/** HTTP request verb. Can be one of either `GET`, `POST`, `PUT`, `PATCH`, or `DELETE` */
export type HttpVerb = `GET` | `POST` | `PUT` | `PATCH` | `DELETE`;

export type HttpResponseType = 'json' | 'text' | 'void';

export type HttpResponse = HashMap | string | void;

export interface HttpOptions {
    headers?: HashMap<string>;
    body?: any;
    response_type?: HttpResponseType;
}

export interface HttpJsonOptions extends HttpOptions {
    response_type?: 'json';
}

export interface HttpTextOptions extends HttpOptions {
    response_type?: 'text';
}

export interface HttpVoidOptions extends HttpOptions {
    response_type?: 'void';
}

export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORISED = 401,
}

export interface HttpError {
    /** HTTP Error code of the message */
    status: HttpStatusCode;
    /** Error message */
    message: string;
    /** Body of the error repsonse */
    response?: any;
}

/** Initialisation parameters for a request handler */
export interface MockHttpRequestHandlerOptions<T = any> {
    /** URL path handled by the object */
    path: string;
    /** HTTP Verb the handler is associated with */
    method: HttpVerb;
    /** Data related to the  */
    metadata?: any;
    /** Callback for handling request to the associated URL */
    callback?: (handler: MockHttpRequest) => T;
    /** Number of milliseconds the response should be returned */
    delay?: number;
    /** Number of milliseconds the delay value can vary */
    delay_variance?: number;
}

/** Interface for data needed to handle Mock HTTP requests */
export interface MockHttpRequestHandler<T = any>
    extends MockHttpRequestHandlerOptions<T> {
    callback: (handler: MockHttpRequest) => T;
    /** Parameter keys for set path */
    path_parts: string[];
    /** Parameter keys for set path */
    path_structure: string[];
}

export interface MockHttpRequest {
    /** URL path requested */
    url: string;
    /** Matched handler path */
    path: string;
    /** Request method */
    method: HttpVerb;
    /** Metadata associated with the request */
    metadata: any;
    /** Route parameters set in the request URL */
    route_params: HashMap<string>;
    /** Query parameters in the request URL */
    query_params: HashMap<string>;
    /** Request body */
    body: any;
}

