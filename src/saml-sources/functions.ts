import { HashMap } from '../utilities/types';
import { PlaceAuthSourceQueryOptions } from '../auth-sources/interfaces';
import {
    create,
    query,
    remove,
    show,
    update,
} from '../resources/functions';
import { PlaceSAMLSource } from './saml-source';

const PATH = 'saml_auths';

function process(item: HashMap) {
    return new PlaceSAMLSource(item);
}

export function querySAMLSources(query_params?: PlaceAuthSourceQueryOptions) {
    return query(query_params, process, PATH);
}

export function showSAMLSource(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateSAMLSource(
    id: string,
    form_data: HashMap | PlaceSAMLSource,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addSAMLSource(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeSAMLSource(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
