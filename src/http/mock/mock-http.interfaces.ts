import { HashMap } from '../../utilities/types.utilities';
import { HttpVerb } from '../http.interfaces';

/** Initialisation parameters for a request handler */
export interface MockHttpRequestHandlerOptions<T = any> {
    /** URL path handled by the object */
    path: string;
    /** HTTP Verb the handler is associated with */
    method: HttpVerb;
    /** Data related to the  */
    metadata?: any;
    /** Callback for handling request to the associated URL */
    callback?: (handler: MockHttpRequest<T>) => T;
    /** Number of milliseconds the response should be returned */
    delay?: number;
    /** Number of milliseconds the delay value can vary */
    delay_variance?: number;
}

/** Interface for data needed to handle Mock HTTP requests */
export interface MockHttpRequestHandler<T = any> extends MockHttpRequestHandlerOptions<T> {
    callback: (handler: MockHttpRequest<T>) => T;
    /** Parameter keys for set path */
    path_parts: string[];
    /** Parameter keys for set path */
    path_structure: string[];
}

export interface MockHttpRequest<T = any> {
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
