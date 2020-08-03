import { HashMap } from '../../../utilities/types.utilities';
import { PlaceResourceQueryOptions } from '../resources/resources.interface';
import { create, query, remove, show, task, update } from '../resources/resources.service';
import { PlaceSystem } from '../systems/system.class';
import { PlaceTrigger } from './trigger.class';

const PATH = 'triggers';
const NAME = 'Triggers';

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
export function listTriggerSystems(id: string): Promise<PlaceSystem[]> {
    return task(
        id,
        `instances`,
        undefined,
        'get',
        (data: HashMap[]) => data.map(sys => new PlaceSystem(sys)),
        PATH
    );
}
