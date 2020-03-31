import { HashMap } from '../../../utilities/types.utilities';
import { EngineResourceQueryOptions } from '../resources/resources.interface';
import { EngineZone } from './zone.class';

/** Mapping of available query paramters for the zones index endpoint */
export interface EngineZoneQueryOptions extends EngineResourceQueryOptions {
    /** List of space seperated tags to filter the results */
    tag?: string;
    /** ID of the system to filter the results */
    control_system_id?: string;
    /** ID of the parent zone to filter the results */
    parent?: string;
}

/** Mapping of available query parameters for the zones show endpoint */
export interface EngineZoneShowOptions {
    /** Includes trigger data in the response (must have support or admin permissions) */
    complete?: boolean;
    /** Returns the specified settings key if the key exists in the zone (available to all authenticated users) */
    data?: string;
}

/** Query param options for getting zone metadata */
export interface EngineZoneMetadataOptions {
    /** Specify key to return, i.e. catering */
    name?: string;
}

/** Query param options for getting child zone metadata */
export interface EngineChildZoneMetadataOptions extends EngineZoneMetadataOptions {
    /** Only return metadata from zones with tags. Comma seperated string */
    tags?: string;
}

/** Child zone metadata */
export interface EngineChildZoneMetadata {
    /** Zone associated with the metadata */
    readonly zone: EngineZone;
    /** Metadata for zone */
    readonly metadata: HashMap;
    /** List of the root keys in the metadata */
    readonly keys: string[];
}

/** Metadata for a zone */
export interface EngineZoneMetadata {
    /** Name/ID of the zone metadata */
    readonly name: string;
    /** Description of what this metadata represents */
    readonly description: string;
    /** Metadata associated with this key. */
    readonly details: HashMap;
}
