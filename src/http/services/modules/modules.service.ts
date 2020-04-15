import { PlaceOS } from '../../../placeos';
import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceService } from '../resources/resources.service';
import { EngineSettings } from '../settings/settings.class';
import { EngineModule } from './module.class';
import { EngineModulePingOptions, EngineModuleQueryOptions } from './module.interfaces';

export class EngineModulesService extends EngineResourceService<EngineModule> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        this._name = 'Module';
        this._api_route = 'modules';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineModuleQueryOptions) {
        return super.query(query_params);
    }

    /**
     * Starts the module with the given ID and clears any existing caches
     * @param id Module ID
     */
    public start(id: string): Promise<void> {
        return this.task(id, 'start');
    }

    /**
     * Stops the module with the given ID
     * @param id Module ID
     */
    public stop(id: string): Promise<void> {
        return this.task(id, 'stop');
    }

    /**
     * Pings the IP address of the module with the given ID
     * @param id Module ID
     */
    public ping(id: string): Promise<EngineModulePingOptions> {
        return this.task(id, 'ping');
    }

    /**
     * Get the internal state of the given module
     * @param id Module ID
     * @param lookup Status variable of interest. If set it will return only the state of this variable
     */
    public state(id: string): Promise<HashMap> {
        return this.task(id, 'state', undefined, 'get');
    }

    /**
     * Get the state of the given module
     * @param id Module ID
     * @param key Status variable of interest. If set it will return only the state of this variable
     */
    public stateLookup(id: string, key: string): Promise<HashMap> {
        return this.task(id, `state/${key}`, undefined, 'get');
    }

    /**
     * Manually load module into PlaceOS core. Only use if module should be loaded but isn't present.
     * @param id Module ID
     */
    public load(id: string): Promise<void> {
        return this.task(id, 'load', undefined, 'post');
    }

    /**
     * Fetch settings of driver associated with the module
     * @param id Module ID
     */
    public settings(id: string): Promise<EngineSettings[]> {
        return this.task(id, 'settings', undefined, 'get', list =>
            list.map((item: HashMap) => new EngineSettings(PlaceOS.settings, item))
        );
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineModule(this, item);
    }
}
