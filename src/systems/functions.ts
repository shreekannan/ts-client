import { create, query, remove, show, task, update } from '../resources/functions';

import { Observable } from 'rxjs';
import { PlaceSettings } from '../settings/settings';
import { PlaceTrigger } from '../triggers/trigger';
import { HashMap } from '../utilities/types';
import { PlaceZone } from '../zones/zone';
import {
    PlaceModuleFunctionMap,
    PlaceSystemShowOptions,
    PlaceSystemsQueryOptions
} from './interfaces';
import { PlaceSystem } from './system';

/**
 * @private
 */
const PATH = 'systems';

/** Convert raw server data to an system object */
function process(item: Partial<PlaceSystem>) {
    return new PlaceSystem(item);
}

/**
 * Query the available systems
 * @param query_params Query parameters to add the to request URL
 */
export function querySystems(query_params?: PlaceSystemsQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a system
 * @param id ID of the system to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showSystem(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the system in the database
 * @param id ID of the system
 * @param form_data New values for the system
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateSystem(
    id: string,
    form_data: Partial<PlaceSystem>,
    query_params: PlaceSystemShowOptions = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new system to the database
 * @param form_data System data
 * @param query_params Query parameters to add the to request URL
 */
export function addSystem(form_data: Partial<PlaceSystem>, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove an system from the database
 * @param id ID of the system
 * @param query_params Query parameters to add the to request URL
 */
export function removeSystem(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * Add module to the given system
 * @param id System ID
 * @param module_id ID of the module to add
 */
export function addSystemModule(
    id: string,
    module_id: string,
    data: HashMap = {}
): Observable<PlaceSystem> {
    return task(id, `module/${module_id}`, data, 'put', d => process(d), PATH);
}

/**
 * Remove module from the given system
 * @param id System ID
 * @param module_id ID of the module to remove
 */
export function removeSystemModule(id: string, module_id: string): Observable<PlaceSystem> {
    return task(id, `module/${module_id}`, {}, 'del', d => process(d), PATH);
}

/**
 * Start the given system and clears any existing caches
 * @param id System ID
 */
export function startSystem(id: string): Observable<void> {
    return task<void>(id, 'start', undefined, undefined, undefined, PATH);
}

/**
 * Stops all modules in the given system
 * @param id System ID
 */
export function stopSystem(id: string): Observable<void> {
    return task<void>(id, 'stop', undefined, undefined, undefined, PATH);
}

/**
 * Execute a function of the given system module
 * @param id System ID
 * @param method Name of the function to execute
 * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
 * @param index Module index. Defaults to `1`
 * @param args Array of arguments to pass to the executed method
 */
export function executeOnSystem(
    id: string,
    method: string,
    module: string,
    index: number = 1,
    args: any[] = []
): Observable<HashMap> {
    return task(id, `${module}_${index}/${method}`, args, undefined, undefined, PATH);
}

/**
 * Get the state of the given system module
 * @param id System ID
 * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
 * @param index Module index. Defaults to `1`
 * @param lookup Status variable of interest. If set it will return only the state of this variable
 */
export function systemModuleState(
    id: string,
    module: string,
    index: number = 1
): Observable<HashMap> {
    return task(id, `${module}_${index}`, undefined, 'get', undefined, PATH);
}

/**
 * Get the state of the given system module
 * @param id System ID
 * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
 * @param index Module index. Defaults to `1`
 * @param lookup Status variable of interest. If set it will return only the state of this variable
 */
export function lookupSystemModuleState(
    id: string,
    module: string,
    index: number = 1,
    lookup: string
): Observable<HashMap> {
    return task(id, `${module}_${index}/${lookup}`, undefined, 'get', undefined, PATH);
}

/**
 * Get the list of functions for the given system module
 * @param id System ID
 * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
 * @param index Module index. Defaults to `1`
 */
export function functionList(
    id: string,
    module: string,
    index: number = 1
): Observable<PlaceModuleFunctionMap> {
    return task(id, `functions/${module}_${index}`, {}, 'get', undefined, PATH);
}

/**
 * Occurances of a particular type of module in the given system
 * @param id System ID
 * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
 */
export function moduleCount(id: string, module: string): Observable<{ count: number }> {
    return task(id, 'count', { module }, 'get', undefined, PATH);
}

/**
 * List types of modules and counts in the given system
 * @param id System ID
 */
export function moduleTypes(id: string): Observable<HashMap<number>> {
    return task(id, 'count', undefined, 'get', undefined, PATH);
}

/**
 * Get list of Zones for system
 * @param id System ID
 */
export function listSystemZones(id: string) {
    return query({}, (i: HashMap) => new PlaceZone(i), `${PATH}/${id}/zones`);
}

/**
 * Get list of triggers for system
 * @param id System ID
 */
export function listSystemTriggers(id: string) {
    return query({}, (i: HashMap) => new PlaceTrigger(i), `${PATH}/${id}/triggers`);
}

/**
 * Get list of triggers for system
 * @param id System ID
 * @param data Values for trigger properties
 */
export function addSystemTrigger(id: string, data: HashMap): Observable<PlaceTrigger> {
    return task(id, 'triggers', data, 'post', (item: any) => new PlaceTrigger(item), PATH);
}

/**
 * Remove trigger from system
 * @param id System ID
 * @param trigger_id ID of the trigger
 */
export function removeSystemTrigger(id: string, trigger_id: string): Observable<void> {
    return task(id, `triggers/${trigger_id}`, undefined, 'del', undefined, PATH);
}

/**
 * Fetch settings of modules, zones and drivers associated with the system
 * @param id System ID
 */
export function systemSettings(id: string): Observable<PlaceSettings[]> {
    return task(
        id,
        'settings',
        undefined,
        'get',
        list => list.map((item: Partial<PlaceSettings>) => new PlaceSettings(item)),
        PATH
    );
}
