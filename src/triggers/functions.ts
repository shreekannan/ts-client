import { Observable } from 'rxjs';
import { HashMap } from '../utilities/types';
import { PlaceResourceQueryOptions } from '../resources/interface';
import {
    create,
    query,
    remove,
    show,
    task,
    update,
} from '../resources/functions';
import { PlaceSystem } from '../systems/system';
import { PlaceTrigger } from './trigger';

const PATH = 'triggers';

function process(item: HashMap) {
    return new PlaceTrigger(item);
}

export function queryTriggers(query_params?: PlaceResourceQueryOptions) {
    return query(query_params, process, PATH);
}

export function showTrigger(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateTrigger(
    id: string,
    form_data: HashMap | PlaceTrigger,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addTrigger(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeTrigger(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * List systems that contain instances of a trigger
 * @param id ID of the trigger to grab system instances for
 */
export function listTriggerSystems(id: string): Observable<PlaceSystem[]> {
    return task(
        id,
        `instances`,
        undefined,
        'get',
        (data: HashMap[]) => data.map(sys => new PlaceSystem(sys)),
        PATH
    );
}