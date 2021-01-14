import { PlaceDriver } from '../drivers/driver';
import { PlaceDriverRole } from '../drivers/enums';
import { PlaceResource } from '../resources/resource';
import { EncryptionLevel } from '../settings/interfaces';
import { PlaceSettings } from '../settings/settings';
import { PlaceSystem } from '../systems/system';
import { HashMap } from '../utilities/types';

/**
 * @hidden
 */
export interface PlaceModuleComplete extends Partial<PlaceModule> {
    dependency_id?: string;
    dependency?: PlaceDriver;
    control_system?: PlaceSystem;
}

/** Function to request the server to stop emitting debug events */
export type EndDebugFn = () => void;

export class PlaceModule extends PlaceResource {
    /** Whether the associated hardware is connected */
    public readonly connected: boolean;
    /** Whether the module driver is running */
    public readonly running: boolean;
    /** Timestamp of last update in ms since UTC epoch */
    public readonly updated_at: number;
    /** ID of the edge associated with the module */
    public readonly edge_id: string;
    /** ID of the driver associated with the module */
    public readonly driver_id: string;
    /** Driver/dependancy associated with the module */
    public readonly driver?: PlaceDriver;
    /** ID of the system associated with the module */
    public readonly control_system_id: string;
    /** System associated with the module */
    public readonly system?: PlaceSystem;
    /** IP address of the hardware associated with the module */
    public readonly ip: string;
    /** Whether the hardware connection requires TLS */
    public readonly tls: boolean;
    /** Whether the hardware connection is over UDP */
    public readonly udp: boolean;
    /** Port number connections to the hardware are made on */
    public readonly port: number;
    /**  */
    public readonly makebreak: boolean;
    /** URI associated with the module */
    public readonly uri: string;
    /** Custom name of the module */
    public readonly custom_name: string;
    /** Type of module */
    public readonly role: PlaceDriverRole;
    /** Notes associated with the module */
    public readonly notes: string;
    /** Ignore connection issues */
    public readonly ignore_connected: boolean;
    /** Tuple of user settings of differring encryption levels for the module */
    public readonly settings: [
        PlaceSettings | null,
        PlaceSettings | null,
        PlaceSettings | null,
        PlaceSettings | null
    ] = [null, null, null, null];
    /** ID of the system associated with the module */
    public get system_id(): string {
        return this.control_system_id;
    }

    constructor(raw_data: PlaceModuleComplete = {}) {
        super(raw_data);
        this.driver_id = raw_data.driver_id || raw_data.dependency_id || '';
        this.control_system_id = raw_data.control_system_id || '';
        this.edge_id = raw_data.edge_id || '';
        this.ip = raw_data.ip || '';
        this.tls = raw_data.tls || false;
        this.udp = raw_data.udp || false;
        this.port = raw_data.port || 1;
        this.makebreak = raw_data.makebreak || false;
        this.uri = raw_data.uri || '';
        this.custom_name = raw_data.custom_name || '';
        this.role =
            typeof raw_data.role === 'number'
                ? raw_data.role
                : PlaceDriverRole.Logic;
        this.notes = raw_data.notes || '';
        this.ignore_connected = raw_data.ignore_connected || false;
        this.connected = raw_data.connected || false;
        this.running = raw_data.running || false;
        this.updated_at = raw_data.updated_at || 0;
        this.system = new PlaceSystem(
            raw_data.control_system || raw_data.system
        );
        this.driver = new PlaceDriver(raw_data.dependency || raw_data.driver);
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

    /**
     * Convert object into plain object
     */
    public toJSON(keep_system: boolean = false): HashMap {
        const obj = super.toJSON();
        if ((obj.role !== PlaceDriverRole.Logic && !keep_system) || !obj.control_system_id) {
            delete obj.control_system_id;
        }
        delete obj.driver;
        delete obj.system;
        return obj;
    }
}
