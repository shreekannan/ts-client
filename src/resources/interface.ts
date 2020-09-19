import { HashMap } from '../utilities/types';

/* tslint:disable */

/** Allowable query parameters for basic index endpoints */
export interface PlaceResourceQueryOptions {
    /**
     * Search filter supporting the following syntax
     * https://www.elastic.co/guide/en/elasticsearch/reference/5.5/query-dsl-simple-query-string-query.html
     */
    q?: string;
    /** Number of results to return. Defaults to `20`. Max `500` */
    limit?: number;
    /** Offsets of the results to return. Max `10000` */
    offset?: number;
    /** Number of milliseconds to cache the query response */
    cache?: number;
    /** Whether the request is a API poll request */
    _poll?: boolean;
}

export interface ResourceService<T = any> {
    query: (fields?: HashMap) => Promise<T[]>;
    show: (id: string, fields?: HashMap) => Promise<T>;
    add: (data: HashMap) => Promise<T>;
    update: (id: string, data: HashMap, fields?: HashMap, type?: 'put' | 'patch') => Promise<T>;
    delete: (id: string) => Promise<void>;
}

export type PlaceDataEventType = 'value_change' | 'item_saved' | 'reset' | 'other';

export interface PlaceDataClassEvent {
    /** Type of event that has occurred on the object */
    type: PlaceDataEventType;
    /** Associated metadata with the event */
    metadata: HashMap;
}

export interface QueryParameters<T> {
    query_params: HashMap;
    fn: (data: Partial<T>) => T;
    path: string;
}

export interface ShowParameters<T> extends QueryParameters<T> {
    id: string;
}

export interface CreateParameters<T> extends QueryParameters<T> {
    form_data: Partial<T>;
}

export interface UpdateParameters<T> extends QueryParameters<T> {
    id: string;
    form_data: HashMap;
    method: 'put' | 'patch';
}

export interface RemoveParameters {
    id: string;
    query_params: HashMap;
    path: string;
}

export interface TaskParameters<T> {
    id: string;
    task_name: string;
    form_data?: any;
    method?: 'post' | 'get' | 'del' | 'put';
    callback?: (_: any) => T;
    path: string;
}
