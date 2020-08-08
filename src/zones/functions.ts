import { Observable } from 'rxjs';
import { HashMap } from '../utilities/types';
import {
    create,
    query,
    remove,
    show,
    task,
    update,
} from '../resources/functions';
import { PlaceTrigger } from '../triggers/trigger';
import { PlaceZone } from './zone';
import { PlaceZoneQueryOptions, PlaceZoneShowOptions } from './interfaces';

const PATH = 'zones';

function process(item: HashMap) {
    return new PlaceZone(item);
}

export function queryZones(query_params?: PlaceZoneQueryOptions) {
    return query(query_params, process, PATH);
}

export function showZone(id: string, query_params: PlaceZoneShowOptions = {}) {
    return show(id, query_params, process, PATH);
}

export function updateZone(
    id: string,
    form_data: HashMap | PlaceZone,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addZone(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeZone(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

export function listZoneTriggers(
    id: string,
    query_params: HashMap = {}
): Observable<PlaceTrigger[]> {
    return task(
        id,
        'triggers',
        query_params,
        'get',
        list => list.map((i: HashMap) => new PlaceTrigger(i)),
        PATH
    );
}
