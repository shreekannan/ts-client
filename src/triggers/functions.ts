import { Observable } from 'rxjs';
import { create, query, remove, show, task, update } from '../resources/functions';
import { PlaceResourceQueryOptions } from '../resources/interface';
import { PlaceSystem } from '../systems/system';
import { HashMap } from '../utilities/types';
import { PlaceTrigger } from './trigger';

/**
 * @private
 */
const PATH = 'triggers';

/** Convert raw server data to a trigger object */
function process(item: Partial<PlaceTrigger>) {
    return new PlaceTrigger(item);
}

/**
 * Query the available triggers
 * @param query_params Query parameters to add the to request URL
 */
export function queryTriggers(query_params?: PlaceResourceQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a trigger
 * @param id ID of the trigger to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showTrigger(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the trigger in the database
 * @param id ID of the trigger
 * @param form_data New values for the trigger
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateTrigger(
    id: string,
    form_data: Partial<PlaceTrigger>,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new trigger to the database
 * @param form_data Trigger data
 * @param query_params Query parameters to add the to request URL
 */
export function addTrigger(form_data: Partial<PlaceTrigger>, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove an trigger from the database
 * @param id ID of the trigger
 * @param query_params Query parameters to add the to request URL
 */
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
        (data: Partial<PlaceSystem>[]) => data.map(sys => new PlaceSystem(sys)),
        PATH
    );
}
