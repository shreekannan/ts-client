import { PlaceResourceQueryOptions } from '../resources/interface';

/** Mapping of available query paramters for the modules index */
export interface PlaceAuthSourceQueryOptions extends PlaceResourceQueryOptions {
    /** ID of the authority to filter the auth sources */
    authority?: string;
}
