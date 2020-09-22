import { cleanObject } from '../utilities/general';
import { HashMap } from '../utilities/types';

export abstract class PlaceResource {
    /** Unique Identifier of the object */
    public readonly id: string;
    /** Human readable name of the object */
    public readonly name: string;
    /** Unix epoch in seconds of the creation time of the object */
    public readonly created_at: number;
    /** Unix epoch in seconds of the creation time of the object */
    public readonly updated_at: number;
    /** Version of the data */
    public readonly version: number;

    constructor(raw_data:  Partial<PlaceResource> = {}) {
        this.id = raw_data.id || '';
        this.name = raw_data.name || '';
        this.created_at = raw_data.created_at || 0;
        this.updated_at = raw_data.updated_at || 0;
        this.version = raw_data.version || 0;
    }

    /**
     * Convert object into plain object
     */
    public toJSON(): HashMap {
        const obj: any = { ...this };
        obj.version += 1;
        /** Remove unneeded public members */
        delete obj.created_at;
        return cleanObject(obj, [undefined, null, '']);
    }
}
