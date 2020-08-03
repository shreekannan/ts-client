
import { HashMap } from '../../../utilities/types.utilities';
import { create, query, remove, show, task, update } from '../resources/resources.service';
import { PlaceSettings } from './settings.class';
import { PlaceSettingsQueryOptions } from './settings.interfaces';

const PATH = 'settingss';
const NAME = 'Settingss';

function process(item: HashMap) {
    return new PlaceSettings(item);
}

export function querySettings(query_params?: PlaceSettingsQueryOptions) {
    return query(query_params, process, PATH);
}

export function showSettings(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateSettings(
    id: string,
    form_data: HashMap | PlaceSettings,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addSettings(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeSettings(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

export function settingsHistory(id: string, query_params: HashMap = {}) {
    return task(
        id,
        'history',
        query_params,
        'get',
        (resp: HashMap) =>
            resp && resp instanceof Array
                ? resp.map(i => process(i))
                : resp && !(resp instanceof Array) && resp.results
                ? (resp.results as HashMap[]).map(i => process(i))
                : [],
        PATH
    );
}
