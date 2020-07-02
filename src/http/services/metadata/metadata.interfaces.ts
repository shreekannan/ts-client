
/** Query param options for getting  metadata */
export interface PlaceMetadataOptions {
    /** Specify key to return, i.e. catering */
    name?: string;
}

/** Query param options for getting child metadata */
export interface PlaceZoneMetadataOptions extends PlaceMetadataOptions {
    /** Only return metadata from s with tags. Comma seperated string */
    tags?: string;
}
