import {
    create,
    remove,
    show,
    task,
    update,
} from '../resources/functions';
import { PlaceMetadata } from './metadata';
import {
    PlaceMetadataOptions,
    PlaceZoneMetadataOptions,
} from './interfaces';
import { PlaceZoneMetadata } from './zone-metadata';

import { Observable } from 'rxjs';
import { HashMap } from '../utilities/types';

const PATH = 'metadata';

function process(item: HashMap) {
    return new PlaceMetadata(item);
}

export function showMetadata(
    id: string,
    query_params?: {}
): Observable<PlaceMetadata[]>;
export function showMetadata(
    id: string,
    query_params: { name: string }
): Observable<PlaceMetadata>;
export function showMetadata(
    id: string,
    query_params: HashMap = {}
): Observable<PlaceMetadata[]> | Observable<PlaceMetadata> {
    return show(
        id,
        query_params,
        query_params.name
            ? process
            : (list: HashMap) => Object.keys(list).map((key: string) => process(list[key])) as any,
        PATH
    );
}

export function updateMetadata(
    id: string,
    form_data: HashMap | PlaceMetadata,
    query_params: PlaceMetadataOptions = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addMetadata(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeMetadata(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

export function listChildMetadata(
    id: string,
    query_params: PlaceZoneMetadataOptions
) {
    return task(
        id,
        'children',
        query_params,
        'get',
        (list: HashMap[]) =>
            list.map(
                item =>
                    new PlaceZoneMetadata({
                        ...item,
                        keys: Object.keys(item.metadata),
                    })
            ),
        PATH
    );
}
