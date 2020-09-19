import { PlaceResource } from '../resources/resource';
import { EncryptionLevel } from '../settings/interfaces';
import { PlaceSettings } from '../settings/settings';
import { PlaceDriverRole } from './enums';

export class PlaceDriver extends PlaceResource {
    /** Place class name of the driver */
    public readonly class_name: string;
    /** Description of the driver functionality */
    public readonly description: string;
    /** Name to use for modules that inherit this driver */
    public readonly module_name: string;
    /** Role of the driver in engine */
    public readonly role: PlaceDriverRole;
    /** Default URI for the driver */
    public readonly default_uri: string;
    /** Default port number for the driver */
    public readonly default_port: number;
    /** ID of the repository the driver is from */
    public readonly repository_id: string;
    /** Name of the file from the repository to load the driver logic from */
    public readonly file_name: string;
    /** Version of the driver logic to use */
    public readonly commit: string;
    /** Ignore connection issues */
    public readonly ignore_connected: boolean;
    /** Tuple of user settings of differring encryption levels for the driver */
    public readonly settings: [
        PlaceSettings | null,
        PlaceSettings | null,
        PlaceSettings | null,
        PlaceSettings | null
    ];

    constructor(raw_data: Partial<PlaceDriver> = {}) {
        super(raw_data);
        this.description = raw_data.description || '';
        this.module_name = raw_data.module_name || '';
        this.role = raw_data.role || PlaceDriverRole.Logic;
        this.default_uri = raw_data.default_uri || '';
        this.default_port = raw_data.default_port || 1;
        this.ignore_connected = raw_data.ignore_connected || false;
        this.class_name = raw_data.class_name || '';
        this.repository_id = raw_data.repository_id || '';
        this.file_name = raw_data.file_name || '';
        this.commit = raw_data.commit || '';
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
    }
}
