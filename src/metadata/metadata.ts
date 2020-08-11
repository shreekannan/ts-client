import { HashMap } from '../utilities/types';

export class PlaceMetadata {
    /** ID of the parent resource associated with the metadata */
    public readonly id: string;
    /** Name/ID of the zone metadata */
    public readonly name: string;
    /** Description of what this metadata represents */
    public readonly description: string;
    /** Metadata associated with this key. */
    public readonly details: HashMap | any[];

    constructor(data: HashMap = {}) {
        this.id = data.id || data.parent_id || '';
        this.name = data.name || '';
        this.description = data.description || '';
        this.details = data.details || {};
    }
}
