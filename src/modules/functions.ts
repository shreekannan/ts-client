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
import { PlaceSettings } from '../settings/settings';
import { PlaceModule } from './module';
import {
    PlaceModulePingOptions,
    PlaceModuleQueryOptions,
} from './interfaces';

const PATH = 'modules';

/** Convert raw server data to a module object */
function process(item: HashMap) {
    return new PlaceModule(item);
}

/**
 * Query the available moduels
 * @param query_params Query parameters to add the to request URL
 */
export function queryModules(query_params?: PlaceModuleQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a module
 * @param id ID of the module to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showModule(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the module in the database
 * @param id ID of the module
 * @param form_data New values for the module
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateModule(
    id: string,
    form_data: HashMap | PlaceModule,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new module to the database
 * @param form_data Module data
 * @param query_params Query parameters to add the to request URL
 */
export function addModule(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove a module from the database
 * @param id ID of the module
 * @param query_params Query parameters to add the to request URL
 */
export function removeModule(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * Starts the module with the given ID and clears any existing caches
 * @param id Module ID
 */
export function startModule(id: string) {
    return task(id, 'start', undefined, undefined, undefined, PATH);
}

/**
 * Stops the module with the given ID
 * @param id Module ID
 */
export function stopModule(id: string) {
    return task(id, 'stop', undefined, undefined, undefined, PATH);
}

/**
 * Pings the IP address of the module with the given ID
 * @param id Module ID
 */
export function pingModule(id: string): Observable<PlaceModulePingOptions> {
    return task(id, 'stop', undefined, undefined, undefined, PATH);
}

/**
 * Get the internal state of the given module
 * @param id Module ID
 * @param lookup Status variable of interest. If set it will return only the state of this variable
 */
export function moduleState(id: string): Observable<HashMap> {
    return task(id, 'state', undefined, 'get', undefined, PATH);
}

/**
 * Get the state of the given module
 * @param id Module ID
 * @param key Status variable of interest. If set it will return only the state of this variable
 */
export function lookupModuleState(
    id: string,
    key: string
): Observable<HashMap> {
    return task(id, `state${key}`, undefined, 'get', undefined, PATH);
}

/**
 * Manually load module into PlaceOS core. Only use if module should be loaded but isn't present.
 * @param id Module ID
 */
export function loadModule(id: string): Observable<HashMap> {
    return task(id, 'load', undefined, 'post', undefined, PATH);
}

/**
 * Fetch settings of driver associated with the module
 * @param id Module ID
 */
export function moduleSettings(id: string) {
    return task(
        id,
        'state',
        undefined,
        'get',
        list => list.map((item: HashMap) => new PlaceSettings(item)),
        PATH
    );
}
