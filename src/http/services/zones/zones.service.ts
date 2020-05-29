import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineResourceService } from '../resources/resources.service';
import { ServiceManager } from '../service-manager.class';
import { EngineZone } from './zone.class';
import {
    EngineChildZoneMetadata,
    EngineChildZoneMetadataOptions,
    EngineZoneMetadata,
    EngineZoneMetadataOptions,
    EngineZoneQueryOptions,
    EngineZoneShowOptions
} from './zone.interfaces';

export class EngineZonesService extends EngineResourceService<EngineZone> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        ServiceManager.setService(EngineZone, this);
        this._name = 'Zone';
        this._api_route = 'zones';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineZoneQueryOptions) {
        return super.query(query_params);
    }

    /**
     * Query the API route for a sepecific item
     * @param id ID of the item
     * @param query_params Map of query paramaters to add to the request URL
     */
    public show(id: string, query_params?: EngineZoneShowOptions) {
        return super.show(id, query_params);
    }

    /**
     * Execute a function of the given modules within the zone
     * @param id Zone ID
     * @param method Name of the function to execute
     * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
     * @param index Module index. Defaults to `1`
     * @param args Array of arguments to pass to the executed method
     */
    public execute(
        id: string,
        method: string,
        module: string,
        index: number = 1,
        args: any[] = []
    ): Promise<HashMap> {
        return this.task(id, `${module}_${index}/${method}`, args);
    }

    /**
     * Retrieve all metadata for the given zone
     * @param id ID of the zone
     * @param query_params Query parameters to pass to the request
     */
    public listMetadata(
        id: string,
        query_params: EngineZoneMetadataOptions = {}
    ): Promise<HashMap<EngineZoneMetadata>> {
        return this.task(id, 'metadata', query_params, 'get');
    }

    /**
     * Add new zone metadata for the given key
     * @param id ID of the zone
     * @param form_data New metadata values
     */
    public createMetadata(id: string, form_data: EngineZoneMetadata): Promise<EngineZoneMetadata> {
        return this.updateMetadata(id, form_data);
    }

    /**
     * Update zone metadata for the given key
     * @param id ID of the zone
     * @param form_data New metadata values
     */
    public updateMetadata(id: string, form_data: EngineZoneMetadata): Promise<EngineZoneMetadata> {
        return this.task(id, 'metadata', form_data, 'post');
    }

    public deleteMetadata(id: string, query_params: EngineZoneMetadataOptions): Promise<void> {
        return this.task(id, 'metadata', query_params, 'delete');
    }

    /**
     * Retrieve all metadata for the given zone's children
     * @param id ID of the zone
     * @param query_params Query parameters to pass to the request
     */
    public listChildMetadata(
        id: string,
        query_params: EngineChildZoneMetadataOptions = {}
    ): Promise<EngineChildZoneMetadata[]> {
        return this.task(id, 'children/metadata', query_params, 'get', (list: HashMap[]) =>
            list.map(item => ({
                zone: new EngineZone(item.zone),
                metadata: item.metadata,
                keys: Object.keys(item.metadata)
            }))
        );
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineZone(item);
    }
}
