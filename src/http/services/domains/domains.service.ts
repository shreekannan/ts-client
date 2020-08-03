import { HashMap } from '../../../utilities/types.utilities';
import { PlaceResourceQueryOptions } from '../resources/resources.interface';
import { create, query, remove, show, update } from '../resources/resources.service';
import { PlaceDomain } from './domain.class';

const PATH = 'domains';
const NAME = 'Domains';

function process(item: HashMap) {
    return new PlaceDomain(item);
}

export function queryDomains(query_params?: PlaceResourceQueryOptions) {
    return query(query_params, process, PATH);
}

export function showDomain(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateDomain(
    id: string,
    form_data: HashMap | PlaceDomain,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addDomain(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeDomain(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
