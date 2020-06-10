import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceQueryOptions } from '../resources/resources.interface';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineSystem } from '../systems/system.class';
import { EngineTrigger } from './trigger.class';

export class EngineTriggersService extends EngineResourceService<EngineTrigger> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineTrigger, this);
        this._name = 'Trigger';
        this._api_route = 'triggers';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineResourceQueryOptions) {
        return super.query(query_params);
    }

    /**
     * Query the API route for a sepecific item
     * @param id ID of the item
     * @param query_params Map of query paramaters to add to the request URL
     */
    public show(id: string, query_params?: {}) {
        return super.show(id, query_params);
    }

    /**
     * List systems that contain instances of a trigger
     * @param id ID of the trigger to grab system instances for
     */
    public listSystems(id: string): Promise<EngineSystem[]> {
        return this.task(id, `instances`, undefined, 'get', (data: HashMap[]) =>
            data.map(sys => new EngineSystem(sys))
        );
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineTrigger(item);
    }
}
