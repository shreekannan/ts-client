import { toQueryString } from '../../../utilities/api.utilities';
import { parseLinkHeader } from '../../../utilities/general.utilities';
import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineSettings } from './settings.class';
import { EngineSettingsQueryOptions } from './settings.interfaces';

export class EngineSettingsService extends EngineResourceService<EngineSettings> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineSettings, this);
        this._name = 'Settings';
        this._api_route = 'settings';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineSettingsQueryOptions) {
        return super.query(query_params);
    }

    public history(id: string, query_params: EngineSettingsQueryOptions = {}) {
        let cache = 1000;
        /* istanbul ignore else */
        if (query_params && query_params.cache) {
            cache = query_params.cache;
            delete query_params.cache;
        }
        const query = toQueryString(query_params);
        const key = `history|${query}`;
        /* istanbul ignore else */
        if (!this._promises[key]) {
            this._promises[key] = new Promise((resolve, reject) => {
                const url = `${this.api_route}/${id}/history${query ? '?' + query : ''}`;
                let result: EngineSettings[] | HashMap[] = [];
                this.http.get(url).subscribe(
                    (resp: HashMap) => {
                        result =
                            resp && resp instanceof Array
                                ? resp.map(i => this.process(i))
                                : resp && !(resp instanceof Array) && resp.results
                                    ? (resp.results as HashMap[]).map(i => this.process(i))
                                    : [];
                    },
                    (e: any) => {
                        reject(e);
                        this.timeout(key, () => delete this._promises[key], 1);
                    },
                    () => {
                        const headers = this.http.responseHeaders(url);
                        if (headers['x-total-count']) {
                            const total = +headers['x-total-count'] || 0;
                            query.length < 2 || query.length < 12 && query.indexOf('offset=') >= 0
                                ? this._total = total
                                : this._last_total = total;
                        }
                        if (headers.Link) {
                            const link_map = parseLinkHeader(headers.Link);
                            this._next = link_map.next;
                        }
                        resolve(result);
                        this.timeout(key, () => delete this._promises[key], cache);
                    }
                );
            });
        }
        return this._promises[key];
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineSettings(item);
    }
}
