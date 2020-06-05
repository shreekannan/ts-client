import { first } from 'rxjs/operators';

import { PlaceOS } from '../../../placeos';
import { HashMap } from '../../../utilities/types.utilities';
import { EngineResource } from '../resources/resource.class';
import { EngineSettings } from '../settings/settings.class';
import { EncryptionLevel } from '../settings/settings.interfaces';
import { EngineTrigger } from '../triggers/trigger.class';
import { EngineChildZoneMetadata, EngineZoneMetadataOptions } from './zone.interfaces';
import { EngineZonesService } from './zones.service';

export const ZONE_MUTABLE_FIELDS = [
    'name',
    'description',
    'parent_id',
    'triggers',
    'tags',
    'location',
    'display_name',
    'code',
    'type',
    'count',
    'capacity',
    'map_id'
] as const;
type ZoneMutableTuple = typeof ZONE_MUTABLE_FIELDS;
export type ZoneMutableFields = ZoneMutableTuple[number];

export class EngineZone extends EngineResource<EngineZonesService> {
    /** Tuple of user settings of differring encryption levels for the zone */
    public readonly settings: [
        EngineSettings | null,
        EngineSettings | null,
        EngineSettings | null,
        EngineSettings | null
    ] = [null, null, null, null];
    /** Description of the zone's purpose */
    public readonly description: string;
    /** ID of the parent zone */
    public readonly parent_id: string;
    /** List of triggers associated with the zone */
    public readonly triggers: readonly string[];
    /** List of tags associated with the zone */
    public readonly tags: string[];
    /** Geo-location details associated with the zone */
    public readonly location: string;
    /** Custom display name for the zone */
    public readonly display_name: string;
    /** Organisational code associated with the zone */
    public readonly code: string;
    /** Organisational categorisation of the zone */
    public readonly type: string;
    /** Count of resources associated with the zone */
    public readonly count: number;
    /** Amount of physical capacity associated with the zone */
    public readonly capacity: number;
    /** ID or URL of or in a map associated with the zone */
    public readonly map_id: string;
    /** List of modules associated with the system. Only available from the show method with the `complete` query parameter */
    public trigger_list: readonly EngineTrigger[] = [];

    constructor(raw_data: HashMap = {}) {
        super(raw_data);
        this.description = raw_data.description || '';
        this.tags = raw_data.tags || [];
        this.triggers = raw_data.triggers || [];
        this.settings = raw_data.settings || [null, null, null, null];
        this.parent_id = raw_data.parent_id || '';
        this.location = raw_data.location || '';
        this.display_name = raw_data.display_name || '';
        this.code = raw_data.code || '';
        this.type = raw_data.type || '';
        this.count = raw_data.count || 0;
        this.capacity = raw_data.capacity || 0;
        this.map_id = raw_data.map_id || '';
        if (typeof this.settings !== 'object') {
            (this as any).settings = [null, null, null, null];
        }
        for (const level in EncryptionLevel) {
            if (!isNaN(Number(level)) && !this.settings[level]) {
                this.settings[level] = new EngineSettings({
                    parent_id: this.id,
                    encryption_level: +level
                });
            }
        }
        if (raw_data.trigger_data && raw_data.trigger_data instanceof Array) {
            this.trigger_list = raw_data.trigger_data.map(
                trigger => new EngineTrigger(trigger)
            );
        }
    }

    /**
     * Retrieve metadata for zone
     * @param query_params Query parameters to add to the request
     */
    public metadata(query_params?: EngineZoneMetadataOptions): Promise<HashMap> {
        return this._service.listMetadata(this.id, query_params);
    }

    /**
     * Retrieve metadata for zone's children
     * @param query_params Query parameters to add to the request
     */
    public childMetadata(query_params?: EngineZoneMetadataOptions): Promise<EngineChildZoneMetadata[]> {
        return this._service.listChildMetadata(this.id, query_params);
    }

    public storePendingChange(key: ZoneMutableFields, value: EngineZone[ZoneMutableFields]): this {
        return super.storePendingChange(key as any, value);
    }
}
