import { HashMap } from '../utilities/types';
import {
    create,
    query,
    remove,
    show,
    update,
} from '../resources/functions';
import { PlaceUser } from './user';
import { PlaceUserQueryOptions } from './interfaces';

/**
 * @private
 */
const PATH = 'users';

/** Convert raw server data to a trigger object */
function process(item: HashMap) {
    return new PlaceUser(item);
}

/**
 * Query the available triggers
 * @param query_params Query parameters to add the to request URL
 */
export function queryUsers(query_params?: PlaceUserQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a trigger
 * @param id ID of the trigger to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showUser(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Get the data for the currently logged in user
 * @param query_params Query parameters to add the to request URL
 */
export function currentUser(query_params: HashMap = {}) {
    return show('current', query_params, process, PATH);
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
    form_data: HashMap | PlaceUser,
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
export function addUser(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove an trigger from the database
 * @param id ID of the trigger
 * @param query_params Query parameters to add the to request URL
 */
export function removeUser(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
