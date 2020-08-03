import { create, query, remove, show, task, update } from '../resources/resources.service';

import { HashMap } from '../../../utilities/types.utilities';
import { PlaceSettings } from '../settings/settings.class';
import { PlaceTrigger } from '../triggers/trigger.class';
import { PlaceZone } from '../zones/zone.class';
import { PlaceSystem } from './system.class';
import {
    PlaceModuleFunctionMap,
    PlaceSystemShowOptions,
    PlaceSystemsQueryOptions
} from './system.interfaces';

const PATH = 'systems';
const NAME = 'Systems';

function process(item: HashMap) {
    return new PlaceSystem(item);
}

export function querySystems(query_params?: PlaceSystemsQueryOptions) {
    return query(query_params, process, PATH);
}

export function showSystem(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateSystem(
    id: string,
    form_data: HashMap | PlaceSystem,
    query_params: PlaceSystemShowOptions = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addSystem(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeSystem(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * Remove module from the given system
 * @param id System ID
 * @param module_id ID of the module to remove
 */
export function addSystemModule(id: string, module_id: string, data: HashMap = {}): Promise<void> {
    return task<void>(id, `module/${module_id}`, data, 'put', undefined, PATH);
}

/**
 * Remove module from the given system
 * @param id System ID
 * @param module_id ID of the module to remove
 */
export function removeSystemModule(id: string, module_id: string): Promise<void> {
    return task<void>(id, `module/${module_id}`, {}, 'del', undefined, PATH);
}

/**
 * Start the given system and clears any existing caches
 * @param id System ID
 */
export function startSystem(id: string): Promise<void> {
    return task<void>(id, 'start', undefined, undefined, undefined, PATH);
}

/**
 * Stops all modules in the given system
 * @param id System ID
 */
export function stopSystem(id: string): Promise<void> {
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
): Promise<HashMap> {
    return task(id, `${module}_${index}/${method}`, args, undefined, undefined, PATH);
}

/**
 * Get the state of the given system module
 * @param id System ID
 * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
 * @param index Module index. Defaults to `1`
 * @param lookup Status variable of interest. If set it will return only the state of this variable
 */
export function systemModuleState(id: string, module: string, index: number = 1): Promise<HashMap> {
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
): Promise<HashMap> {
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
): Promise<PlaceModuleFunctionMap> {
    return task(id, `functions/${module}_${index}`, {}, 'get', undefined, PATH);
}

/**
 * Occurances of a particular type of module in the given system
 * @param id System ID
 * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
 */
export function moduleCount(id: string, module: string): Promise<{ count: number }> {
    return task(id, 'count', { module }, 'get', undefined, PATH);
}

/**
 * List types of modules and counts in the given system
 * @param id System ID
 */
export function moduleTypes(id: string): Promise<HashMap<number>> {
    return task(id, 'count', undefined, 'get', undefined, PATH);
}

/**
 * Get list of Zones for system
 * @param id System ID
 */
export function listSystemZones(id: string): Promise<PlaceZone[]> {
    return task(
        id,
        'zones',
        undefined,
        'get',
        (list: any[]) => list.map(item => new PlaceZone(item)),
        PATH
    );
}

/**
 * Get list of triggers for system
 * @param id System ID
 */
export function listSystemTriggers(id: string): Promise<PlaceTrigger[]> {
    return task(
        id,
        'triggers',
        undefined,
        'get',
        (list: any[]) => list.map(item => new PlaceTrigger(item)),
        PATH
    );
}

/**
 * Get list of triggers for system
 * @param id System ID
 * @param data Values for trigger properties
 */
export function addSystemTrigger(id: string, data: HashMap): Promise<PlaceTrigger> {
    return task(id, 'triggers', data, 'post', (item: any) => new PlaceTrigger(item), PATH);
}

/**
 * Remove trigger from system
 * @param id System ID
 * @param trigger_id ID of the trigger
 */
export function removeSystemTrigger(id: string, trigger_id: string): Promise<void> {
    return task(id, `triggers/${trigger_id}`, undefined, 'del', undefined, PATH);
}

/**
 * Fetch settings of modules, zones and drivers associated with the system
 * @param id System ID
 */
export function systemSettings(id: string): Promise<PlaceSettings[]> {
    return task(
        id,
        'settings',
        undefined,
        'get',
        list => list.map((item: HashMap) => new PlaceSettings(item)),
        PATH
    );
}
