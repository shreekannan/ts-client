import { HashMap } from '../../../utilities/types.utilities';
import { PlaceResourceQueryOptions } from '../resources/resources.interface';
import { PlaceZone } from './zone.class';

/** Mapping of available query paramters for the zones index endpoint */
export interface PlaceZoneQueryOptions extends PlaceResourceQueryOptions {
    /** List of space seperated tags to filter the results */
    tags?: string;
    /** ID of the system to filter the results */
    control_system_id?: string;
    /** ID of the parent zone to filter the results */
    parent?: string;
}

/** Mapping of available query parameters for the zones show endpoint */
export interface PlaceZoneShowOptions {
    /** Includes trigger data in the response (must have support or admin permissions) */
    complete?: boolean;
    /**
     * Returns the specified settings key if the key exists
     * in the zone (available to all authenticated users)
     */
    data?: string;
}
