import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineApplication } from './application.class';
import { EngineApplicationQueryOptions } from './application.interfaces';

export class EngineApplicationsService extends EngineResourceService<EngineApplication> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineApplication, this);
        this._name = 'Application';
        this._api_route = 'oauth_apps';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineApplicationQueryOptions) {
        return super.query(query_params);
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineApplication(item);
    }
}
