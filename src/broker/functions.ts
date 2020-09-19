import { create, query, remove, show, update } from '../resources/functions';
import { HashMap } from '../utilities/types';
import { PlaceMQTTBroker } from './broker';

/**
 * @private
 */
const PATH = 'brokers';

/** Convert raw server data to a broker object */
function process(item: Partial<PlaceMQTTBroker>) {
    return new PlaceMQTTBroker(item);
}

/**
 * Query the available MQTT brokers
 * @param query_params Query parameters to add the to request URL
 */
export function queryBrokers(query_params?: HashMap) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a MQTT broker
 * @param id ID of the broker to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showBroker(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the MQTT broker data
 * @param id ID of the broker
 * @param form_data New values for the broker
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateBroker(
    id: string,
    form_data: Partial<PlaceMQTTBroker>,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new MQTT broker to the database
 * @param form_data Broker data
 * @param query_params Query parameters to add the to request URL
 */
export function addBroker(form_data: Partial<PlaceMQTTBroker>, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove a MQTT broker from the database
 * @param id ID of the broker
 * @param query_params Query parameters to add the to request URL
 */
export function removeBroker(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}
