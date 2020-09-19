import { create, query, remove, show, task, update } from '../resources/functions';
import { HashMap } from '../utilities/types';
import { PlaceSettingsQueryOptions } from './interfaces';
import { PlaceSettings } from './settings';

/**
 * @private
 */
const PATH = 'settings';

/** Convert raw server data to an settings object */
function process(item: Partial<PlaceSettings>) {
    return new PlaceSettings(item);
}

/**
 * Query the available settings
 * @param query_params Query parameters to add the to request URL
 */
export function querySettings(query_params: PlaceSettingsQueryOptions = {}) {
    return query({ query_params, fn: process, path: PATH });
}

/**
 * Get the data for settings
 * @param id ID of the settings to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showSettings(id: string, query_params: HashMap = {}) {
    return show({ id, query_params, fn: process, path: PATH });
}

/**
 * Update the settings in the database
 * @param id ID of the settings
 * @param form_data New values for the settings
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateSettings(
    id: string,
    form_data: Partial<PlaceSettings>,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update({ id, form_data, query_params, method, fn: process, path: PATH });
}

/**
 * Add a new settings to the database
 * @param form_data Settings data
 * @param query_params Query parameters to add the to request URL
 */
export function addSettings(form_data: Partial<PlaceSettings>, query_params: HashMap = {}) {
    return create({ form_data, query_params, fn: process, path: PATH });
}

/**
 * Remove an settings from the database
 * @param id ID of the settings
 * @param query_params Query parameters to add the to request URL
 */
export function removeSettings(id: string, query_params: HashMap = {}) {
    return remove({ id, query_params, path: PATH });
}

/**
 * Get historical version of settings
 * @param id ID of the settings to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function settingsHistory(id: string, query_params: HashMap = {}) {
    return task({
        id,
        task_name: 'history',
        form_data: query_params,
        method: 'get',
        callback: (resp: HashMap[]) => resp.map((i) => process(i)),
        path: PATH,
    });
}
