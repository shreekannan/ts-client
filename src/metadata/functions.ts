import { Observable } from 'rxjs';
import { create, remove, show, task, update } from '../resources/functions';
import { HashMap } from '../utilities/types';
import { PlaceZoneMetadataOptions } from './interfaces';
import { PlaceMetadata } from './metadata';
import { PlaceZoneMetadata } from './zone-metadata';

/**
 * @private
 */
const PATH = 'metadata';

/** Convert raw server data to a metadata object */
function process(item: Partial<PlaceMetadata>) {
    return new PlaceMetadata(item);
}

/**
 * Get the metadata for a database item
 * @param id ID of the item to retrieve metadata
 * @param query_params Query parameters to add the to request URL.
 *  Use key `name` to retrieve specific metadata
 */
export function showMetadata(id: string, query_params?: {}): Observable<PlaceMetadata[]>;
export function showMetadata(id: string, query_params: { name: string }): Observable<PlaceMetadata>;
export function showMetadata(
    id: string,
    query_params: HashMap = {}
): Observable<PlaceMetadata[]> | Observable<PlaceMetadata> {
    return show({
        id,
        query_params,
        fn: query_params.name
            ? (data: HashMap) => process(data[query_params.name])
            : (list: HashMap) => Object.keys(list).map((key: string) => process(list[key])) as any,
        path: PATH,
    });
}

/**
 * Update the metadata in the database
 * @param id ID of the item associated with the metadata
 * @param form_data New values for the metadata
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateMetadata(
    id: string,
    form_data: Partial<PlaceMetadata>,
    method: 'put' | 'patch' = 'patch'
) {
    return update({ id, form_data, query_params: {}, method, fn: process, path: PATH });
}

export function addMetadata(form_data: Partial<PlaceMetadata>) {
    return create({ form_data, query_params: {}, fn: process, path: PATH });
}

/**
 * Remove an metadata from the database
 * @param id ID of the item associated with the metadata
 * @param query_params Query parameters to add the to request URL
 */
export function removeMetadata(id: string, query_params: HashMap = {}) {
    return remove({ id, query_params, path: PATH });
}

/**
 * Query metadata of associated child items
 * @param id ID of the item to get associated child metadata
 * @param query_params Query parameters to add the to request URL
 */
export function listChildMetadata(id: string, query_params: PlaceZoneMetadataOptions) {
    return task({
        id,
        task_name: 'children',
        form_data: query_params,
        method: 'get',
        callback: (list: HashMap[]) =>
            list.map(
                (item) =>
                    new PlaceZoneMetadata({
                        ...item,
                        keys: Object.keys(item.metadata),
                    })
            ),
        path: PATH
    });
}
