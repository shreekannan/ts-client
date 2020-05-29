import { toQueryString } from '../../../utilities/api.utilities';
import { HashMap } from '../../../utilities/types.utilities';
import { HttpError } from '../../http.interfaces';
import { EngineHttpClient } from '../../http.service';
import { EngineDriverDetails } from '../drivers/drivers.interfaces';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineRepository } from './repository.class';
import { EngineRepositoryCommitQuery, EngineRepositoryDetailsQuery, EngineRepositoryPullQuery, GitCommitDetails } from './repository.interfaces';

export class EngineRepositoriesService extends EngineResourceService<EngineRepository> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineRepository, this);
        this._name = 'Repository';
        this._api_route = 'repositories';
    }

    /**
     * Get a list of all the interfaces
     * @param query_params Addition query parameters to pass to the request
     */
    public async listInterfaces(query_params: HashMap = {}): Promise<HashMap<string>> {
        const query = toQueryString(query_params);
        const key = `interfaces|${query}`;
        /* istanbul ignore else */
        if (!this._promises[key]) {
            this._promises[key] = new Promise((resolve, reject) => {
                const url = `${this.api_route}/interfaces${query ? '?' + query : ''}`;
                let result: any;
                this.http.get(url).subscribe(
                    (d: HashMap) => result = d,
                    (e: HttpError) => {
                        reject(e);
                        delete this._promises[key];
                    },
                    () => {
                        resolve(result);
                        this.timeout(key, () => delete this._promises[key], 1000);
                    }
                );
            });
        }
        return this._promises[key];
    }

    /**
     * Get a list of all the drivers for a repository
     * @param id ID of the repository
     * @param query Addition query parameters to pass to the request
     */
    public async listDrivers(id: string, query?: HashMap): Promise<string[]> {
        return await this.task(id, 'drivers', query || {}, 'get');
    }

    /**
     * Get a list of all the commits for a repository
     * @param id ID of the repository
     * @param query Addition query parameters to pass to the request
     */
    public async listCommits(id: string, query: EngineRepositoryCommitQuery = {}): Promise<GitCommitDetails[]> {
        return await this.task(id, 'commits', query, 'get');
    }

    /**
     * Get the details for a given driver
     * @param id ID of the repository
     * @param query Addition query parameters to pass to the request
     */
    public async driverDetails(id: string, query: EngineRepositoryDetailsQuery): Promise<EngineDriverDetails> {
        return await this.task(id, 'details', query, 'get');
    }

    /**
     * Pull remote changes to the repository
     * @param id ID of the repository
     * @param query Addition query parameters to pass to the request
     */
    public async pullCommit(id: string, query?: EngineRepositoryPullQuery): Promise<EngineDriverDetails> {
        return await this.task(id, 'pull', query, 'post');
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineRepository(item);
    }
}
