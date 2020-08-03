import { PlaceResourceQueryOptions } from '../resources/resources.interface';

/** Mapping of available query paramters for the users index */
export interface PlaceUserQueryOptions extends PlaceResourceQueryOptions {
    /** Return only users on the given domain */
    authority_id?: string;
}
