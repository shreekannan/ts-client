import { EngineResourceService } from '../resources/resources.service';
import { PlaceMetadata } from './metadata.class';
import { PlaceZoneMetadataOptions } from './metadata.interfaces';
import { PlaceZoneMetadata } from './zone-metadata.class';

import { toQueryString } from '../../../utilities/api.utilities';
import { HashMap } from '../../../utilities/types.utilities';
import { HttpError } from '../../http.interfaces';
import { EngineHttpClient } from '../../http.service';

export class PlaceMetadataService extends EngineResourceService<PlaceMetadata> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        this._name = 'Metadata';
        this._api_route = 'metadata';
    }

    /**
     * Make post request for a new item to the service
     * @param form_data Data to post to the server
     * @param query_params Map of query paramaters to add to the request URL
     * @param id ID of the metadata parent
     */
    public add(form_data: HashMap, query_params: HashMap, id: string = 'default'): Promise<PlaceMetadata> {
        return super.add(form_data, query_params, `${this.api_route}/${id}`);
    }

    /**
     * Retrieve all metadata for the given zone's children
     * @param id ID of the zone
     * @param query_params Query parameters to pass to the request
     */
    public listChildMetadata(
        id: string,
        query_params: PlaceZoneMetadataOptions = {}
    ): Promise<PlaceZoneMetadata[]> {
        return this.task(id, 'children', query_params, 'get', (list: HashMap[]) =>
            list.map(item => new PlaceZoneMetadata({ ...item, keys: Object.keys(item.metadata) }))
        );
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new PlaceMetadata(item);
    }
}
