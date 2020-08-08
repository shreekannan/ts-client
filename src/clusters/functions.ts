import { HashMap } from '../utilities/types';
import { query, remove, show } from '../resources/functions';
import { PlaceCluster } from './cluster';
import { PlaceClusterQueryOptions } from './interfaces';
import { PlaceProcess } from './process';

const PATH = 'clusters';

function process(item: HashMap) {
    return new PlaceCluster(item);
}

export function queryClusters(query_params?: PlaceClusterQueryOptions) {
    return query(query_params, process, PATH);
}

export function queryProcesses(id: string, query_params: HashMap = {}) {
    return show(
        id,
        query_params,
        (list: any) => list.map((item: HashMap) => new PlaceProcess(id, item)),
        PATH
    );
}

export function terminateProcess(id: string, query_params: { driver: string }) {
    return remove(id, query_params, PATH);
}
