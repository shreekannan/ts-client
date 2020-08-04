import { create, remove, show, task, update } from '../resources/resources.service';
import { PlaceMetadata } from './metadata.class';
import { PlaceMetadataOptions, PlaceZoneMetadataOptions } from './metadata.interfaces';
import { PlaceZoneMetadata } from './zone-metadata.class';

import { Observable } from 'rxjs';
import { HashMap } from '../../../utilities/types.utilities';

const PATH = 'metadata';
const NAME = 'Metadata';

function process(item: HashMap) {
    return new PlaceMetadata(item);
}

export function showMetadata(id: string, query_params?: {}): Observable<PlaceMetadata[]>;
export function showMetadata(id: string, query_params: { name: string }): Observable<PlaceMetadata>;
export function showMetadata(
    id: string,
    query_params: HashMap = {}
): Observable<PlaceMetadata[]> | Observable<PlaceMetadata> {
    return show(
        id,
        query_params,
        query_params.name ? process : list => list.map((i: HashMap) => process(i)),
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

export function listChildMetadata(id: string, query_params: PlaceZoneMetadataOptions) {
    return task(
        id,
        'children',
        query_params,
        'get',
        (list: HashMap[]) =>
            list.map(item => new PlaceZoneMetadata({ ...item, keys: Object.keys(item.metadata) })),
        PATH
    );
}
