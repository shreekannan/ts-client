import { EngineResourceService } from '../resources/resources.service';
import { PlaceMetadata } from './metadata.class';
import { PlaceZoneMetadataOptions } from './metadata.interfaces';
import { PlaceZoneMetadata } from './zone-metadata.class';

import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';

export class PlaceMetadataService extends EngineResourceService<PlaceMetadata> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        this._name = 'Metadata';
        this._api_route = 'metadata';
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
