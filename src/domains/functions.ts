import { HashMap } from '../utilities/types';
import { PlaceResourceQueryOptions } from '../resources/interface';
import { create, query, remove, show, update } from '../resources/functions';
import { PlaceDomain } from './domain';

/**
 * @private
 */
const PATH = 'domains';

/** Convert raw server data to a domain object */
function process(item: Partial<PlaceDomain>) {
    return new PlaceDomain(item);
}

/**
 * Query the available domains
 * @param query_params Query parameters to add the to request URL
 */
export function queryDomains(query_params?: PlaceResourceQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a domain
 * @param id ID of the domain to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showDomain(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the domain in the database
 * @param id ID of the domain
 * @param form_data New values for the domain
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateDomain(
    id: string,
    form_data: Partial<PlaceDomain>,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new domain to the database
 * @param form_data Domain data
 * @param query_params Query parameters to add the to request URL
 */
export function addDomain(form_data: Partial<PlaceDomain>, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove a domain from the database
 * @param id ID of the domain
 * @param query_params Query parameters to add the to request URL
 */
export function removeDomain(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
