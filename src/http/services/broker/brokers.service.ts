import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { PlaceMQTTBroker } from './broker.class';

export class PlaceMQTTBrokerService extends EngineResourceService<any> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(PlaceMQTTBroker, this);
        this._name = 'Broker';
        this._api_route = 'brokers';
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new PlaceMQTTBroker(item);
    }
}
