import { HashMap } from '../utilities/types';
import {
    create,
    query,
    remove,
    show,
    update,
} from '../resources/functions';
import { PlaceMQTTBroker } from './broker';

const PATH = 'brokers';

function process(item: HashMap) {
    return new PlaceMQTTBroker(item);
}

export function queryBrokers(query_params?: HashMap) {
    return query(query_params, process, PATH);
}

export function showBroker(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateBroker(
    id: string,
    form_data: HashMap | PlaceMQTTBroker,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addBroker(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeBroker(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
