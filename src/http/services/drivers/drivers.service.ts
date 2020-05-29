import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineDriver } from './driver.class';
import { EngineDriverQueryOptions } from './drivers.interfaces';

export class EngineDriversService extends EngineResourceService<EngineDriver> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineDriver, this);
        this._name = 'Driver';
        this._api_route = 'drivers';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineDriverQueryOptions) {
        return super.query(query_params);
    }

    /**
     * Recompiles and reloads the latest version of the given driver
     * @param id Driver ID
     */
    public recompile(id: string): Promise<void> {
        return this.task(id, 'recompile');
    }

    /**
     * Checks if the driver has been compiled on the server. Resolves if compiled, rejects otherwise
     * @param id Driver ID
     */
    public isCompiled(id: string): Promise<void> {
        return this.task(id, 'compiled', undefined, 'get');
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineDriver(item);
    }
}
