import { EngineResourceService } from '../resources/resources.service';

import { PlaceOS } from '../../../placeos';
import { HashMap } from '../../../utilities/types.utilities';
import { EngineHttpClient } from '../../http.service';
import { EngineSettings } from '../settings/settings.class';
import { EngineTrigger } from '../triggers/trigger.class';
import { EngineZone } from '../zones/zone.class';
import { EngineSystem } from './system.class';
import {
    EngineModuleFunctionMap,
    EngineSystemShowOptions,
    EngineSystemsQueryOptions
} from './system.interfaces';

export class EngineSystemsService extends EngineResourceService<EngineSystem> {
    /* istanbul ignore next */
    constructor(protected http: EngineHttpClient) {
        super(http);
        EngineSystem.setService('EngineSystem', this);
        this._name = 'System';
        this._api_route = 'systems';
    }

    /**
     * Query the index of the API route associated with this service
     * @param query_params Map of query paramaters to add to the request URL
     */
    public query(query_params?: EngineSystemsQueryOptions) {
        return super.query(query_params);
    }

    /**
     * Query the API route for a sepecific item
     * @param id ID of the item
     * @param query_params Map of query paramaters to add to the request URL
     */
    public show(id: string, query_params?: EngineSystemShowOptions) {
        return super.show(id, query_params);
    }

    /**
     * Remove module from the given system
     * @param id System ID
     * @param module_id ID of the module to remove
     */
    public addModule(id: string, module_id: string, data: HashMap = {}): Promise<void> {
        return this.task(id, `module/${module_id}`, data, 'put');
    }

    /**
     * Remove module from the given system
     * @param id System ID
     * @param module_id ID of the module to remove
     */
    public removeModule(id: string, module_id: string): Promise<void> {
        return this.task(id, `module/${module_id}`, {}, 'delete');
    }

    /**
     * Start the given system and clears any existing caches
     * @param id System ID
     */
    public startSystem(id: string): Promise<void> {
        return this.task(id, 'start');
    }

    /**
     * Stops all modules in the given system
     * @param id System ID
     */
    public stopSystem(id: string): Promise<void> {
        return this.task(id, 'stop');
    }

    /**
     * Execute a function of the given system module
     * @param id System ID
     * @param method Name of the function to execute
     * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
     * @param index Module index. Defaults to `1`
     * @param args Array of arguments to pass to the executed method
     */
    public execute(
        id: string,
        method: string,
        module: string,
        index: number = 1,
        args: any[] = []
    ): Promise<HashMap> {
        return this.task(id, `${module}_${index}/${method}`, args);
    }

    /**
     * Get the state of the given system module
     * @param id System ID
     * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
     * @param index Module index. Defaults to `1`
     * @param lookup Status variable of interest. If set it will return only the state of this variable
     */
    public state(id: string, module: string, index: number = 1): Promise<HashMap> {
        return this.task(id, `${module}_${index}`, undefined, 'get');
    }

    /**
     * Get the state of the given system module
     * @param id System ID
     * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
     * @param index Module index. Defaults to `1`
     * @param lookup Status variable of interest. If set it will return only the state of this variable
     */
    public stateLookup(
        id: string,
        module: string,
        index: number = 1,
        lookup: string
    ): Promise<HashMap> {
        return this.task(id, `${module}_${index}/${lookup}`, undefined, 'get');
    }

    /**
     * Get the list of functions for the given system module
     * @param id System ID
     * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
     * @param index Module index. Defaults to `1`
     */
    public functionList(
        id: string,
        module: string,
        index: number = 1
    ): Promise<EngineModuleFunctionMap> {
        return this.task(id, `functions/${module}_${index}`, {}, 'get');
    }

    /**
     * Occurances of a particular type of module in the given system
     * @param id System ID
     * @param module Class name of the Module e.g. `Display`, `Lighting` etc.
     */
    public count(id: string, module: string): Promise<{ count: number }> {
        return this.task(id, 'count', { module }, 'get');
    }

    /**
     * List types of modules and counts in the given system
     * @param id System ID
     */
    public types(id: string): Promise<HashMap<number>> {
        return this.task(id, 'count', undefined, 'get');
    }

    /**
     * Get list of triggers for system
     * @param id System ID
     */
    public listZones(id: string): Promise<EngineZone[]> {
        return this.task(id, 'zones', undefined, 'get', (list: any[]) =>
            list.map(item => new EngineZone(item))
        );
    }

    /**
     * Get list of triggers for system
     * @param id System ID
     */
    public listTriggers(id: string): Promise<EngineTrigger[]> {
        return this.task(id, 'triggers', undefined, 'get', (list: any[]) =>
            list.map(item => new EngineTrigger(item))
        );
    }

    /**
     * Get list of triggers for system
     * @param id System ID
     * @param data Values for trigger properties
     */
    public addTrigger(id: string, data: HashMap): Promise<EngineTrigger> {
        return this.task(
            id,
            'triggers',
            data,
            'post',
            (item: any) => new EngineTrigger(item)
        );
    }

    /**
     * Remove trigger from system
     * @param id System ID
     * @param trigger_id ID of the trigger
     */
    public removeTrigger(id: string, trigger_id: string): Promise<void> {
        return this.task(id, `triggers/${trigger_id}`, undefined, 'delete');
    }

    /**
     * Fetch settings of modules, zones and drivers associated with the system
     * @param id System ID
     */
    public settings(id: string): Promise<EngineSettings[]> {
        return this.task(id, 'settings', undefined, 'get', list =>
            list.map((item: HashMap) => new EngineSettings(item))
        );
    }

    /**
     * Convert API data into local interface
     * @param item Raw API data
     */
    protected process(item: HashMap) {
        return new EngineSystem(item);
    }
}
