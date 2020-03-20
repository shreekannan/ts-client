import { first } from 'rxjs/operators';

import { PlaceOS } from '../../../placeos';
import { HashMap } from '../../../utilities/types.utilities';
import { EngineResource } from '../resources/resource.class';
import { EngineSettings } from '../settings/settings.class';
import { EncryptionLevel } from '../settings/settings.interfaces';
import { EngineDriverRole } from './drivers.enums';
import { EngineDriversService } from './drivers.service';

export const DRIVER_MUTABLE_FIELDS = [
    'name',
    'description',
    'module_name',
    'role',
    'default_uri',
    'default_port',
    'ignore_connected',
    'repository_id',
    'file_name',
    'commit'
] as const;
type DriverMutableTuple = typeof DRIVER_MUTABLE_FIELDS;
export type DriverMutableFields = DriverMutableTuple[number];

/** List of property keys that can only be set when creating a new object */
const NON_EDITABLE_FIELDS = ['role', 'repository_id', 'file_name'];

export class EngineDriver extends EngineResource<EngineDriversService> {
    /** Engine class name of the driver */
    public readonly class_name: string;
    /** Description of the driver functionality */
    public readonly description: string;
    /** Name to use for modules that inherit this driver */
    public readonly module_name: string;
    /** Role of the driver in engine */
    public readonly role: EngineDriverRole;
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
        EngineSettings | null,
        EngineSettings | null,
        EngineSettings | null,
        EngineSettings | null
    ];

    constructor(protected _service: EngineDriversService, raw_data: HashMap) {
        super(_service, raw_data);
        this.description = raw_data.description || '';
        this.module_name = raw_data.module_name || '';
        this.role = raw_data.role || EngineDriverRole.Logic;
        this.default_uri = raw_data.default_uri || '';
        this.default_port = raw_data.default_port || 1;
        this.ignore_connected = raw_data.ignore_connected || false;
        this.class_name = raw_data.class_name || '';
        this.repository_id = raw_data.repository_id || '';
        this.file_name = raw_data.file_name || '';
        this.commit = raw_data.commit || '';
        this.settings = raw_data.settings || [null, null, null, null];
        PlaceOS.initialised.pipe(first(has_inited => has_inited)).subscribe(() => {
            if (typeof this.settings !== 'object') {
                (this as any).settings = [null, null, null, null];
            }
            for (const level in EncryptionLevel) {
                if (!isNaN(Number(level)) && !this.settings[level]) {
                    this.settings[level] = new EngineSettings(PlaceOS.settings, {
                        encryption_level: level
                    });
                }
            }
        });
    }

    public storePendingChange(
        key: DriverMutableFields,
        value: EngineDriver[DriverMutableFields]
    ): this {
        return super.storePendingChange(key as any, value);
    }

    /**
     * Live load/reload the driver
     */
    public reload(): Promise<void> {
        /* istanbul ignore else */
        if (!this.id) {
            throw new Error('You must save the module before it can be started');
        }
        return this._service.reload(this.id);
    }
}
