import { Observable } from 'rxjs';
import { HashMap } from '../utilities/types';
import {
    create,
    query,
    remove,
    show,
    task,
    update,
} from '../resources/functions';
import { PlaceTrigger } from '../triggers/trigger';
import { PlaceZone } from './zone';
import { PlaceZoneQueryOptions, PlaceZoneShowOptions } from './interfaces';

const PATH = 'zones';

/** Convert raw server data to an application object */
function process(item: HashMap) {
    return new PlaceZone(item);
}

/**
 * Query the available applications
 * @param query_params Query parameters to add the to request URL
 */
export function queryZones(query_params?: PlaceZoneQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for an application
 * @param id ID of the application to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showZone(id: string, query_params: PlaceZoneShowOptions = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the application in the database
 * @param id ID of the application
 * @param form_data New values for the application
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateZone(
    id: string,
    form_data: HashMap | PlaceZone,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new application to the database
 * @param form_data Application data
 * @param query_params Query parameters to add the to request URL
 */
export function addZone(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove an application from the database
 * @param id ID of the application
 * @param query_params Query parameters to add the to request URL
 */
export function removeZone(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * Query the triggers for a zone
 * @param id ID of the zone
 * @param query_params Query parameters to add the to request URL
 */
export function listZoneTriggers(
    id: string,
    query_params: HashMap = {}
): Observable<PlaceTrigger[]> {
    return task(
        id,
        'triggers',
        query_params,
        'get',
        list => list.map((i: HashMap) => new PlaceTrigger(i)),
        PATH
    );
}
