import { HashMap } from '../../../utilities/types.utilities';
import { create, query, remove, show, update } from '../resources/resources.service';
import { PlaceUser } from './user.class';
import { PlaceUserQueryOptions } from './user.interfaces';

const PATH = 'users';
const NAME = 'Users';

function process(item: HashMap) {
    return new PlaceUser(item);
}

export function queryUsers(query_params?: PlaceUserQueryOptions) {
    return query(query_params, process, PATH);
}

export function showUser(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function currentUser(query_params: HashMap = {}) {
    return show('current', query_params, process, PATH);
}

export function updateUser(
    id: string,
    form_data: HashMap | PlaceUser,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addUser(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeUser(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
