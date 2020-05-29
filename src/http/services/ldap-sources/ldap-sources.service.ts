import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineAuthSourceQueryOptions } from '../auth-sources/auth-source.interfaces';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineLDAPSource } from './ldap-source.class';

export class EngineLDAPSourcesService extends EngineResourceService<EngineLDAPSource> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineLDAPSource, this);
        this._name = 'LDAP Authentication Source';
        this._api_route = 'ldap_auths';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineAuthSourceQueryOptions) {
        return super.query(query_params);
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineLDAPSource(item);
    }
}
