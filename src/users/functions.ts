import { create, query, remove, show, update } from '../resources/functions';
import { HashMap } from '../utilities/types';
import { PlaceUserQueryOptions } from './interfaces';
import { PlaceUser } from './user';

/**
 * @private
 */
const PATH = 'users';

/** Convert raw server data to a trigger object */
function process(item: Partial<PlaceUser>) {
    return new PlaceUser(item);
}

/**
 * Query the available triggers
 * @param query_params Query parameters to add the to request URL
 */
export function queryUsers(query_params: PlaceUserQueryOptions = {}) {
    return query({ query_params, fn: process, path: PATH });
}

/**
 * Get the data for a trigger
 * @param id ID of the trigger to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showUser(id: string, query_params: PlaceUserQueryOptions = {}) {
    return show({ id, query_params, fn: process, path: PATH });
}

/**
 * Get the data for the currently logged in user
 * @param query_params Query parameters to add the to request URL
 */
export function currentUser(query_params: PlaceUserQueryOptions = {}) {
    return show({ id: 'current', query_params, fn: process, path: PATH });
}

/**
 * Update the trigger in the database
 * @param id ID of the trigger
 * @param form_data New values for the trigger
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateUser(
    id: string,
    form_data: Partial<PlaceUser>,
    method: 'put' | 'patch' = 'patch'
) {
    return update({ id, form_data, query_params: {}, method, fn: process, path: PATH });
}

/**
 * Add a new trigger to the database
 * @param form_data Trigger data
 * @param query_params Query parameters to add the to request URL
 */
export function addUser(form_data: Partial<PlaceUser>) {
    return create({ form_data, query_params: {}, fn: process, path: PATH });
}

/**
 * Remove an trigger from the database
 * @param id ID of the trigger
 * @param query_params Query parameters to add the to request URL
 */
export function removeUser(id: string, query_params: HashMap = {}) {
    return remove({ id, query_params, path: PATH });
}
