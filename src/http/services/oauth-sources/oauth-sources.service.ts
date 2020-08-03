import { HashMap } from '../../../utilities/types.utilities';
import { PlaceAuthSourceQueryOptions } from '../auth-sources/auth-source.interfaces';
import { create, query, remove, show, update } from '../resources/resources.service';
import { PlaceOAuthSource } from './oauth-source.class';

const PATH = 'oauth_sources';
const NAME = 'OAuth Authentication Sources';

function process(item: HashMap) {
    return new PlaceOAuthSource(item);
}

export function queryOAuthSources(query_params?: PlaceAuthSourceQueryOptions) {
    return query(query_params, process, PATH);
}

export function showOAuthSource(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateOAuthSource(
    id: string,
    form_data: HashMap | PlaceOAuthSource,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addOAuthSource(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeOAuthSource(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
