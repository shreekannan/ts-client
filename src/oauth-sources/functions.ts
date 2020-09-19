import { PlaceAuthSourceQueryOptions } from '../auth-sources/interfaces';
import { create, query, remove, show, update } from '../resources/functions';
import { HashMap } from '../utilities/types';
import { PlaceOAuthSource } from './oauth-source';

/**
 * @private
 */
const PATH = 'oauth_auths';

/** Convert raw server data to an OAuth source object */
function process(item: Partial<PlaceOAuthSource>) {
    return new PlaceOAuthSource(item);
}

/**
 * Query the available OAuth sources
 * @param query_params Query parameters to add the to request URL
 */
export function queryOAuthSources(query_params: PlaceAuthSourceQueryOptions = {}) {
    return query({ query_params, fn: process, path: PATH });
}

/**
 * Get the data for an OAuth source
 * @param id ID of the OAuth source to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showOAuthSource(id: string, query_params: HashMap = {}) {
    return show({ id, query_params, fn: process, path: PATH });
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
    form_data: Partial<PlaceOAuthSource>,
    method: 'put' | 'patch' = 'patch'
) {
    return update({ id, form_data, query_params: {}, method, fn: process, path: PATH });
}

/**
 * Add a new OAuth source to the database
 * @param form_data OAuth source data
 * @param query_params Query parameters to add the to request URL
 */
export function addOAuthSource(form_data: Partial<PlaceOAuthSource>) {
    return create({form_data, query_params: {}, fn: process, path: PATH});
}

/**
 * Remove an OAuth source from the database
 * @param id ID of the OAuth source
 * @param query_params Query parameters to add the to request URL
 */
export function removeOAuthSource(id: string, query_params: HashMap = {}) {
    return remove({ id, query_params, path: PATH });
}
