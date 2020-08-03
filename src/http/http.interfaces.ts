import { HashMap } from '../utilities/types.utilities';

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
    UNAUTHORISED = 401
}

export interface HttpError {
    /** HTTP Error code of the message */
    status: HttpStatusCode;
    /** Error message */
    message: string;
    /** Body of the error repsonse */
    response?: any;
}
