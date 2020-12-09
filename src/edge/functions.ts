import { PlaceAuthSourceQueryOptions } from '../auth-sources/interfaces';
import { create, query, remove, show, task, update } from '../resources/functions';
import { HashMap } from '../utilities/types';
import { PlaceEdge } from './edge';

/**
 * @private
 */
const PATH = 'edge';

/** Convert raw server data to an Edge object */
function process(item: Partial<PlaceEdge>) {
    return new PlaceEdge(item);
}

/**
 * Query the available Edges
 * @param query_params Query parameters to add the to request URL
 */
export function queryEdges(query_params: PlaceAuthSourceQueryOptions = {}) {
    return query({ query_params, fn: process, path: PATH });
}

/**
 * Get the data for an Edge
 * @param id ID of the Edge to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showEdge(id: string, query_params: HashMap = {}) {
    return show({ id, query_params, fn: process, path: PATH });
}

/**
 * Update the Edge in the database
 * @param id ID of the Edge
 * @param form_data New values for the Edge
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateEdge(
    id: string,
    form_data: Partial<PlaceEdge>,
    method: 'put' | 'patch' = 'patch'
) {
    return update({ id, form_data, query_params: {}, method, fn: process, path: PATH });
}

/**
 * Add a new Edge node to the database
 * @param form_data Edge data
 * @param query_params Query parameters to add the to request URL
 */
export function addEdge(form_data: Partial<PlaceEdge>) {
    return create({ form_data, query_params: {}, fn: process, path: PATH });
}

/**
 * Remove an Edge node from the database
 * @param id ID of the Edge
 * @param query_params Query parameters to add the to request URL
 */
export function removeEdge(id: string, query_params: HashMap = {}) {
    return remove({ id, query_params, path: PATH });
}

/**
 * Generate token for Edge connection
 * @param id ID of the Edge
 * @param query_params Query parameters to add the to request URL
 */
export function retrieveEdgeToken(id: string, query_params: HashMap = {}) {
    return task<{ token: string }>({
        id,
        task_name: 'token',
        form_data: query_params,
        method: 'get',
        path: PATH,
    });
}
