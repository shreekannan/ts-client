import { HashMap } from '../utilities/types';
import {
    create,
    query,
    remove,
    show,
    update,
} from '../resources/functions';
import { PlaceApplication } from './application';
import { PlaceApplicationQueryOptions } from './interfaces';

/**
 * @private
 */
const PATH = 'oauth_apps';

/** Convert raw server data to an application object */
function process(item: Partial<PlaceApplication>) {
    return new PlaceApplication(item);
}

/**
 * Query the available applications
 * @param query_params Query parameters to add the to request URL
 */
export function queryApplications(query_params?: PlaceApplicationQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for an application
 * @param id ID of the application to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showApplication(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the application in the database
 * @param id ID of the application
 * @param form_data New values for the application
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateApplication(
    id: string,
    form_data: Partial<PlaceApplication>,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new application to the database
 * @param form_data Application data
 * @param query_params Query parameters to add the to request URL
 */
export function addApplication(form_data: Partial<PlaceApplication>, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove an application from the database
 * @param id ID of the application
 * @param query_params Query parameters to add the to request URL
 */
export function removeApplication(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
