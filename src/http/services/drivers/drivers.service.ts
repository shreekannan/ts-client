import { HashMap } from '../../../utilities/types.utilities';
import { create, query, remove, show, task, update } from '../resources/resources.service';
import { PlaceDriver } from './driver.class';
import { PlaceDriverQueryOptions } from './drivers.interfaces';

const PATH = 'drivers';
const NAME = 'Drivers';

function process(item: HashMap) {
    return new PlaceDriver(item);
}

export function queryDrivers(query_params?: PlaceDriverQueryOptions) {
    return query(query_params, process, PATH);
}

export function showDriver(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateDriver(
    id: string,
    form_data: HashMap | PlaceDriver,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addDriver(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeDriver(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

export function recompileDriver(id: string) {
    return task(id, 'recompile', undefined, undefined, undefined, PATH);
}

export function isDriverCompiled(id: string) {
    return task(id, 'compiled', undefined, 'get', undefined, PATH);
}
