import { cleanObject } from '../../../utilities/general.utilities';
import { HashMap } from '../../../utilities/types.utilities';

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
    private readonly _version: number;

    constructor(raw_data: HashMap = {}) {
        this.id = raw_data.id || '';
        this.name = raw_data.name || '';
        this.created_at = raw_data.created_at || 0;
        this.updated_at = raw_data.updated_at || 0;
        this._version = raw_data.version || 0;
    }

    /**
     * Convert object into plain object
     */
    public toJSON(): HashMap {
        const obj: any = { ...this };
        /** Remove protected members */
        obj.version = obj._version;
        delete obj._version;
        /** Remove unneeded public members */
        delete obj.created_at;
        return cleanObject(obj, [undefined, null, '']);
    }
}
