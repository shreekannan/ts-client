
import { HashMap } from '../../../utilities/types.utilities';
import { create, query, remove, show, task, update } from '../resources/resources.service';
import { PlaceSettings } from '../settings/settings.class';
import { PlaceModule } from './module.class';
import { PlaceModulePingOptions, PlaceModuleQueryOptions } from './module.interfaces';

const PATH = 'modules';
const NAME = 'Modules';

function process(item: HashMap) {
    return new PlaceModule(item);
}

export function queryModules(query_params?: PlaceModuleQueryOptions) {
    return query(query_params, process, PATH);
}

export function showModule(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateModule(
    id: string,
    form_data: HashMap | PlaceModule,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addModule(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

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
export function pingModule(id: string): Promise<PlaceModulePingOptions> {
    return task(id, 'stop', undefined, undefined, undefined, PATH);
}

/**
 * Get the internal state of the given module
 * @param id Module ID
 * @param lookup Status variable of interest. If set it will return only the state of this variable
 */
export function moduleState(id: string): Promise<HashMap> {
    return task(id, 'state', undefined, 'get', undefined, PATH);
}

/**
 * Get the state of the given module
 * @param id Module ID
 * @param key Status variable of interest. If set it will return only the state of this variable
 */
export function lookupModuleState(id: string, key: string): Promise<HashMap> {
    return task(id, `state${key}`, undefined, 'get', undefined, PATH);
}

/**
 * Manually load module into PlaceOS core. Only use if module should be loaded but isn't present.
 * @param id Module ID
 */
export function loadModule(id: string): Promise<HashMap> {
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
