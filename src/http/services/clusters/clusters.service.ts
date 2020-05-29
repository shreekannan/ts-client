import { toQueryString } from '../../../utilities/api.utilities';
import { HashMap } from '../../../utilities/types.utilities';
import { HttpError } from '../../http.interfaces';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineCluster } from './cluster.class';
import { EngineClusterQueryOptions } from './cluster.interfaces';
import { EngineProcess } from './process.class';

export class EngineClustersService extends EngineResourceService<any> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineCluster, this);
        ServiceManager.setService(EngineProcess, this);
        EngineProcess.service = this;
        this._name = 'Clusters';
        this._api_route = 'cluster';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineClusterQueryOptions) {
        return super.query(query_params);
    }

    public show(id: string, query_params?: EngineClusterQueryOptions): Promise<EngineProcess[]> {
        const query = toQueryString(query_params || {});
        const key = `show|${id}|${query}`;
        /* istanbul ignore else */
        if (!this._promises[key]) {
            this._promises[key] = new Promise<EngineProcess[]>((resolve, reject) => {
                const url = `${this.api_route}/${id}${query ? '?' + query : ''}`;
                const error =  (e?: HttpError) => {
                    if (e) { reject(e); }
                    delete this._promises[key];
                };
                let result: EngineProcess[];
                this.http.get(url).subscribe(
                    (resp: any) => {
                        (result = resp.map((item: HashMap) => new EngineProcess(id, item)));
                    },
                    error,
                    () => {
                        resolve(result);
                        this.timeout(key, error, 1000);
                    }
                );
            });
        }
        return this._promises[key];
    }

    public delete(id: string, query_params: { driver: string }) {
        return super.delete(id, query_params);
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineCluster(item);
    }
}
