import { HashMap } from '../utilities/types';
import {
    create,
    query,
    remove,
    show,
    task,
    update,
} from '../resources/functions';
import { PlaceDriver } from './driver';
import { PlaceDriverQueryOptions } from './interfaces';

const PATH = 'drivers';

/** Convert raw server data to a driver object */
function process(item: HashMap) {
    return new PlaceDriver(item);
}

/**
 * Query the available drivers
 * @param query_params Query parameters to add the to request URL
 */
export function queryDrivers(query_params?: PlaceDriverQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a driver
 * @param id ID of the driver to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showDriver(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the driver in the database
 * @param id ID of the driver
 * @param form_data New values for the driver
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateDriver(
    id: string,
    form_data: HashMap | PlaceDriver,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new driver to the database
 * @param form_data Driver data
 * @param query_params Query parameters to add the to request URL
 */
export function addDriver(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove a driver from the database
 * @param id ID of the driver
 * @param query_params Query parameters to add the to request URL
 */
export function removeDriver(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * Request a recompilation of the driver's code
 * @param id ID of the driver
 */
export function recompileDriver(id: string) {
    return task(id, 'recompile', undefined, undefined, undefined, PATH);
}

/**
 * Query the compiled state of the driver's code
 * @param id ID of the driver
 */
export function isDriverCompiled(id: string) {
    return task(id, 'compiled', undefined, 'get', undefined, PATH);
}
