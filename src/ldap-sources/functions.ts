import { HashMap } from '../utilities/types';
import { PlaceAuthSourceQueryOptions } from '../auth-sources/interfaces';
import {
    create,
    query,
    remove,
    show,
    update,
} from '../resources/functions';
import { PlaceLDAPSource } from './ldap-source';

const PATH = 'ldap_auths';

function process(item: HashMap) {
    return new PlaceLDAPSource(item);
}

export function queryLDAPSources(query_params?: PlaceAuthSourceQueryOptions) {
    return query(query_params, process, PATH);
}

export function showLDAPSource(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateLDAPSource(
    id: string,
    form_data: HashMap | PlaceLDAPSource,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addLDAPSource(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeLDAPSource(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}