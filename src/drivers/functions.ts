import { create, query, remove, show, task, update } from '../resources/functions';
import { HashMap } from '../utilities/types';
import { PlaceDriver } from './driver';
import { PlaceDriverQueryOptions } from './interfaces';

/**
 * @private
 */
const PATH = 'drivers';

/** Convert raw server data to a driver object */
function process(item: Partial<PlaceDriver>) {
    return new PlaceDriver(item);
}

/**
 * Query the available drivers
 * @param query_params Query parameters to add the to request URL
 */
export function queryDrivers(query_params: PlaceDriverQueryOptions = {}) {
    return query({ query_params, fn: process, path: PATH });
}

/**
 * Get the data for a driver
 * @param id ID of the driver to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showDriver(id: string, query_params: HashMap = {}) {
    return show({ id, query_params, fn: process, path: PATH });
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
    form_data: Partial<PlaceDriver>,
    method: 'put' | 'patch' = 'patch'
) {
    return update({ id, form_data, query_params: {}, method, fn: process, path: PATH });
}

/**
 * Add a new driver to the database
 * @param form_data Driver data
 * @param query_params Query parameters to add the to request URL
 */
export function addDriver(form_data: Partial<PlaceDriver>) {
    return create({ form_data, query_params: {}, fn: process, path: PATH });
}

/**
 * Remove a driver from the database
 * @param id ID of the driver
 * @param query_params Query parameters to add the to request URL
 */
export function removeDriver(id: string, query_params: HashMap = {}) {
    return remove({ id, query_params, path: PATH });
}

/**
 * Request a recompilation of the driver's code
 * @param id ID of the driver
 */
export function recompileDriver(id: string) {
    return task({ id, task_name: 'recompile', path: PATH });
}

/**
 * Query the compiled state of the driver's code
 * @param id ID of the driver
 */
export function isDriverCompiled(id: string) {
    return task({ id, task_name: 'compiled', method: 'get', path: PATH });
}
