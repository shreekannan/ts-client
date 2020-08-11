import { HashMap } from '../utilities/types';
import { query, remove, show } from '../resources/functions';
import { PlaceCluster } from './cluster';
import { PlaceClusterQueryOptions } from './interfaces';
import { PlaceProcess } from './process';

/**
 * @private
 */
const PATH = 'clusters';

/** Convert raw server data to a cluster object */
function process(item: HashMap) {
    return new PlaceCluster(item);
}

/**
 * Query the available clusters
 * @param query_params Query parameters to add the to request URL
 */
export function queryClusters(query_params?: PlaceClusterQueryOptions) {
    return query(query_params, process, PATH);
}

/**
 * Query the available process for a cluster
 * @param id ID of the cluster to query
 * @param query_params Query parameters to add the to request URL
 */
export function queryProcesses(id: string, query_params: HashMap = {}) {
    return show(
        id,
        query_params,
        (list: any) => list.map((item: HashMap) => new PlaceProcess(id, item)),
        PATH
    );
}


/**
 * Terminal a process in a cluster
 * @param id ID of the cluster associated with the process
 * @param driver Name of the process to kill
 */
export function terminateProcess(id: string, driver: string) {
    return remove(id, { driver }, PATH);
}
