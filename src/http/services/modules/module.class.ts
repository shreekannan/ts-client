
import { first } from 'rxjs/operators';

import { PlaceOS } from '../../../placeos';
import { HashMap } from '../../../utilities/types.utilities';
import { EngineDriver } from '../drivers/driver.class';
import { EngineDriverRole } from '../drivers/drivers.enums';
import { EngineResource } from '../resources/resource.class';
import { EngineSettings } from '../settings/settings.class';
import { EngineSystem } from '../systems/system.class';
import { EngineModulePingOptions } from './module.interfaces';
import { EngineModulesService } from './modules.service';

export const MODULE_MUTABLE_FIELDS = [
    'name',
    'driver_id',
    'control_system_id',
    'ip',
    'tls',
    'udp',
    'port',
    'makebreak',
    'uri',
    'custom_name',
    'role',
    'notes',
    'ignore_connected'
] as const;
type ModuleMutableTuple = typeof MODULE_MUTABLE_FIELDS;
export type ModuleMutableFields = ModuleMutableTuple[number];

/** List of property keys that can only be set when creating a new object */
const NON_EDITABLE_FIELDS = ['driver_id', 'control_system_id', 'role'];

/** Function to request the server to stop emitting debug events */
export type EndDebugFn = () => void;

export class EngineModule extends EngineResource<EngineModulesService> {
    /** Whether the associated hardware is connected */
    public readonly connected: boolean;
    /** Whether the module driver is running */
    public readonly running: boolean;
    /** Timestamp of last update in ms since UTC epoch */
    public readonly updated_at: number;
    /** ID of the driver associated with the module */
    public readonly driver_id: string;
    /** Driver/dependancy associated with the module */
    public readonly driver?: EngineDriver;
    /** ID of the system associated with the module */
    public readonly control_system_id: string;
    /** System associated with the module */
    public readonly system?: EngineSystem;
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
    public readonly role: EngineDriverRole;
    /** Notes associated with the module */
    public readonly notes: string;
    /** Ignore connection issues */
    public readonly ignore_connected: boolean;
    /** Map of user settings for the system */
    public settings: EngineSettings;
    /** ID of the system associated with the module */
    public get system_id(): string { return this.control_system_id; }

    constructor(protected _service: EngineModulesService, raw_data: HashMap) {
        super(_service, raw_data);
        this.driver_id = raw_data.driver_id || raw_data.dependency_id || '';
        this.control_system_id = raw_data.control_system_id || '';
        this.ip = raw_data.ip || '';
        this.tls = raw_data.tls || false;
        this.udp = raw_data.udp || false;
        this.port = raw_data.port || 1;
        this.makebreak = raw_data.makebreak || false;
        this.uri = raw_data.uri || '';
        this.custom_name = raw_data.custom_name || '';
        this.role = raw_data.role || EngineDriverRole.Logic;
        this.notes = raw_data.notes || '';
        this.ignore_connected = raw_data.ignore_connected || false;
        this.connected = raw_data.connected || false;
        this.running = raw_data.running || false;
        this.updated_at = raw_data.updated_at || 0;
        this.settings = new EngineSettings({} as any, raw_data.settings || { parent_id: this.id });
        PlaceOS.initialised.pipe(first(_ => !!_)).subscribe(() => {
            this.settings = new EngineSettings(
                PlaceOS.settings,
                raw_data.settings || { parent_id: this.id }
            );
        });
        try {
            this.system = new EngineSystem(
                PlaceOS.systems,
                raw_data.control_system || raw_data.system || {}
            );
            this.driver = new EngineDriver(
                PlaceOS.drivers,
                raw_data.dependency || raw_data.driver || {}
            );
        } catch (error) {
            const str = 'error';
            console[str](error);
        }
    }

    public storePendingChange(
        key: ModuleMutableFields,
        value: EngineModule[ModuleMutableFields]
    ): this {
        if (this.id && NON_EDITABLE_FIELDS.indexOf(key) >= 0) {
            throw new Error(`Property "${key}" is not editable.`);
        }
        return super.storePendingChange(key as any, value);
    }

    /**
     * Start the module and clears any existing caches
     */
    public start(): Promise<void> {
        if (!this.id) {
            throw new Error('You must save the module before it can be started');
        }
        return this._service.start(this.id);
    }

    /**
     * Stops the module
     */
    public stop(): Promise<void> {
        if (!this.id) {
            throw new Error('You must save the module before it can be stopped');
        }
        return this._service.stop(this.id);
    }

    /**
     * Pings the module
     */
    public ping(): Promise<EngineModulePingOptions> {
        if (!this.id) {
            throw new Error('You must save the module before it can be pinged');
        }
        return this._service.ping(this.id);
    }

    /**
     * Get the state of the module
     * @param lookup Status variable of interest. If set it will return only the state of this variable
     */
    public stateLookup(lookup: string): Promise<HashMap> {
        if (!this.id) {
            throw new Error('You must save the module before it\'s state can be grabbed');
        }
        return this._service.stateLookup(this.id, lookup);
    }

    /**
     * Get the internal state of the module
     */
    public state(): Promise<HashMap> {
        if (!this.id) {
            throw new Error('You must save the module before it\'s internal state can be grabbed');
        }
        return this._service.state(this.id);
    }

    /**
     * Request server to start emitting debug events through the realtime API
     */
    public async debug(): Promise<EndDebugFn> {
        const binding_details = { sys: this.control_system_id, mod: this.id, index: 1, name: 'debug' };
        await PlaceOS.realtime.debug(binding_details);
        return () => PlaceOS.realtime.ignore({ ...binding_details, name: 'ignore' });
    }
}
