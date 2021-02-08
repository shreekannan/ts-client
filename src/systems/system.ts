
import { PlaceModule } from '../modules/module';
import { PlaceResource } from '../resources/resource';
import { EncryptionLevel } from '../settings/interfaces';
import { PlaceSettings } from '../settings/settings';

/**
 * @hidden
 */
export interface PlaceSystemComplete extends Partial<PlaceSystem> {
    module_data?: PlaceModule[];
}

export class PlaceSystem extends PlaceResource {
    /** Tuple of user settings of differring encryption levels for the system */
    public readonly settings: [
        PlaceSettings | null,
        PlaceSettings | null,
        PlaceSettings | null,
        PlaceSettings | null
    ] = [null, null, null, null];
    /** Display name of the system */
    public readonly display_name: string;
    /** Description of the system */
    public readonly description: string;
    /** Email address associated with the system */
    public readonly email: string;
    /** Capacity of the space associated with the system */
    public readonly capacity: number;
    /** Features associated with the system */
    public readonly features: string[];
    /** Whether system is bookable by end users */
    public readonly bookable: boolean;
    /** Count of UI devices attached to the system */
    public readonly installed_ui_devices: number;
    /** Support URL for the system */
    public readonly support_url: string;
    /** ID on the SVG Map associated with this system */
    public readonly map_id: string;
    /** List of module IDs that belong to the system */
    public readonly modules: readonly string[];
    /** List of images associated with the system */
    public readonly images: readonly string[];
    /** List of the zone IDs that the system belongs */
    public readonly zones: readonly string[];
    /**
     * List of modules associated with the system.
     * Only available from the show method with the `complete` query parameter
     */
    public module_list: readonly PlaceModule[] = [];

    constructor(raw_data: PlaceSystemComplete = {}) {
        super(raw_data);
        this.display_name = raw_data.display_name || '';
        this.description = raw_data.description || '';
        this.email = raw_data.email || '';
        this.capacity = raw_data.capacity || 0;
        this.features = raw_data.features || [];
        this.bookable = raw_data.bookable || false;
        this.installed_ui_devices = raw_data.installed_ui_devices || 0;
        this.support_url = raw_data.support_url || '';
        this.map_id = raw_data.map_id || '';
        this.modules = raw_data.modules || [];
        this.images = raw_data.images || [];
        this.zones = raw_data.zones || [];
        this.settings = raw_data.settings || [null, null, null, null];
        if (typeof this.settings !== 'object') {
            (this as any).settings = [null, null, null, null];
        }
        for (const level in EncryptionLevel) {
            if (!isNaN(Number(level)) && !this.settings[level]) {
                this.settings[level] = new PlaceSettings({
                    parent_id: this.id,
                    encryption_level: +level,
                });
            }
        }
        if (raw_data.module_data && raw_data.module_data instanceof Array) {
            this.module_list = raw_data.module_data.map(
                mod => new PlaceModule(mod)
            );
        }
    }
}
