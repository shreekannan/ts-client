import { HashMap } from '../utilities/types';
import { PlaceAuthSourceQueryOptions } from '../auth-sources/interfaces';
import {
    create,
    query,
    remove,
    show,
    update,
} from '../resources/functions';
import { PlaceOAuthSource } from './oauth-source';

/**
 * @private
 */
const PATH = 'oauth_auths';

/** Convert raw server data to an OAuth source object */
function process(item: HashMap) {
    return new PlaceOAuthSource(item);
}

/**
 * Query the available OAuth sources
 * @param query_params Query parameters to add the to request URL
 */
export function queryOAuthSources(query_params?: PlaceAuthSourceQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for an OAuth source
 * @param id ID of the OAuth source to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showOAuthSource(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the OAuth source in the database
 * @param id ID of the OAuth source
 * @param form_data New values for the OAuth source
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateOAuthSource(
    id: string,
    form_data: HashMap | PlaceOAuthSource,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new OAuth source to the database
 * @param form_data OAuth source data
 * @param query_params Query parameters to add the to request URL
 */
export function addOAuthSource(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove an OAuth source from the database
 * @param id ID of the OAuth source
 * @param query_params Query parameters to add the to request URL
 */
export function removeOAuthSource(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
