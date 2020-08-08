import { PlaceResourceQueryOptions } from '../resources/interface';

/** Mapping of available query paramters for the modules index */
export interface PlaceModuleQueryOptions extends PlaceResourceQueryOptions {
    /** Returns modules that are in the given system */
    control_system_id?: string;
    /** Returns modules with the given dependency */
    driver_id?: string;
    /** Return results that connected state matches this value */
    connected?: boolean;
    /** Return modules that are running or not stopped */
    running?: boolean;
    /** Returns modules that are not logic modules (i.e. they connect to a device or service) */
    no_logic?: boolean;
    /**
     * Returns modules that have not been updated since the
     * value defined as seconds since UTC epoch
     */
    as_of?: number;
}

/** Place response from `ping` module task endpoint `/api/engine/v2/<mod_id>/ping` */
export interface PlaceModulePingOptions {
    /** Host address of the module device */
    host: string;
    /** Whether the host address was pingable */
    pingable: boolean;
    /** Any warning returned from the ping attempt */
    warning?: string;
    /** Any exception thrown from the ping attempt */
    exception?: string;
}
