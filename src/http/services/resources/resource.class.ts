import { Subject, Subscription } from 'rxjs';

import { cleanObject } from '../../../utilities/general.utilities';
import { HashMap } from '../../../utilities/types.utilities';
import { ServiceManager } from '../service-manager.class';
import { ResourceService } from './resources.interface';
import { EngineDataClassEvent, EngineDataEventType } from './resources.interface';

export const BASE_MUTABLE_FIELDS = ['name'] as const;
type BaseMutableTuple = typeof BASE_MUTABLE_FIELDS;
export type BaseMutableFields = BaseMutableTuple[number];

export abstract class EngineResource<T extends ResourceService<any>> {

    /** Service for managing model on the server */
    protected get _service(): T {
        return ServiceManager.serviceFor((this as any).constructor) || ServiceManager.serviceFor(EngineResource);
    }

    /**
     * Get map of changes to the resources
     */
    public get changes(): HashMap {
        return { ...this._changes };
    }
    /** Map of available services for child classes */
    private static _service_map: HashMap<ResourceService> = {};
    /** Unique Identifier of the object */
    public readonly id: string;
    /** Human readable name of the object */
    public readonly name: string;
    /** Unix epoch in seconds of the creation time of the object */
    public readonly created_at: number;
    /** Unix epoch in seconds of the creation time of the object */
    public readonly updated_at: number;
    /** Subject for change events to the class object */
    public readonly changeEvents = new Subject<EngineDataClassEvent>();
    /** Map of unsaved property changes */
    protected _changes: HashMap = {};
    /** Map of local property names to server ones */
    protected _server_names: HashMap = {};
    /** Version of the data */
    protected _version: number;
    /** Subscription for initialisation events */
    protected _init_sub?: Subscription;

    constructor(raw_data: HashMap = {}) {
        this.id = raw_data.id || '';
        this.name = raw_data.name || '';
        this.created_at = raw_data.created_at || 0;
        this.updated_at = raw_data.updated_at || 0;
        this._version = raw_data.version || 0;
    }

    /**
     * Store new value for given property
     * @param key Name of the property to store the new value
     * @param value New value for the property
     */
    public storePendingChange(key: string, value: any): this {
        const object: any = this;
        const type = typeof object[key as any];
        if (typeof value === type) {
            this._changes[key as any] = value;
            this.emit('value_change', { key, value });
        } else {
            throw new Error(
                `Invalid type for value "${value}" set for key "${key}". Expected ${type} | Received ${typeof value}`
            );
        }
        return this;
    }

    /**
     * Clear any pending changes to object
     */
    public clearPendingChanges(): void {
        delete this._changes;
        this._changes = {};
        this.emit('reset');
    }

    /**
     * Emits change event
     * @param type Type of change that has occurred
     * @param metadata Supporting metadata for the event
     */
    public emit(type: EngineDataEventType, metadata: HashMap = {}): void {
        this.changeEvents.next({ type, metadata });
    }

    /**
     * Save any changes made to the server
     */
    public save(type: 'put' | 'patch' = 'patch'): Promise<EngineResource<any>> {
        const metadata: HashMap = this.toJSON(true);
        return this.saveWith(type, metadata);
    }

    /**
     * Make request to delete the resource on the server
     */
    public delete(): Promise<void> {
        return (this._service as any).delete(this.id);
    }

    /**
     * Convert object into plain object
     */
    public toJSON(this: EngineResource<T>, with_changes: boolean = true): HashMap {
        const obj: any = { ...this };
        /** Remove protected members */
        delete obj._service;
        delete obj._changes;
        delete obj._init_sub;
        delete obj._server_names;
        delete obj.__type;
        /** Remove unneeded public members */
        delete obj.changeEvents;
        delete obj.created_at;
        const keys = Object.keys(obj);
        for (const key of keys) {
            if (key[0] === '_') {
                const new_key = this._server_names[key.substr(1)] || key.substr(1);
                obj[new_key] = obj[key];
                delete obj[key];
            } else if (obj[key] === undefined) {
                delete obj[key];
            }
        }
        const output = with_changes ? { ...obj, ...this._changes } : obj;
        return cleanObject(output, [undefined, null, '']);
    }

    /**
     * Update the value of a property
     * @param prop_name Name of the property
     * @param value New value for the property
     */
    protected change<U = any>(prop_name: string, value: U) {
        this._changes[prop_name] = value;
    }

    /**
     * Save data to server as item of this type
     * @param type Request verb
     * @param data Metadata to save to the server
     */
    protected saveWith(type: string, data: HashMap) {
        if (Object.keys(this._changes).length > 0) {
            return new Promise<EngineResource<any>>((resolve, reject) => {
                const on_error = (err: any) => reject(err);
                this.id
                    ? this._service.update(this.id, data, { version: this._version }, type as any).then(
                          (updated_item: EngineResource<any>) => {
                              this.emit('item_saved', updated_item);
                              resolve(updated_item);
                          },
                          on_error
                      )
                    : this._service.add(data).then(
                        (new_item: EngineResource<any>) => {
                              this.emit('item_saved', new_item);
                              resolve(new_item);
                          },
                          on_error
                      );
            });
        } else {
            return Promise.reject('No changes have been made');
        }
    }
}
