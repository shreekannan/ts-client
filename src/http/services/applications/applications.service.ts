import { HashMap } from '../../../utilities/types.utilities';
import { create, query, remove, show, update } from '../resources/resources.service';
import { PlaceApplication } from './application.class';
import { PlaceApplicationQueryOptions } from './application.interfaces';

const PATH = 'applications';
const NAME = 'Applications';

function process(item: HashMap) {
    return new PlaceApplication(item);
}

export function queryApplications(query_params?: PlaceApplicationQueryOptions) {
    return query(query_params, process, PATH);
}

export function showApplication(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateApplication(
    id: string,
    form_data: HashMap | PlaceApplication,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addApplication(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeApplication(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
