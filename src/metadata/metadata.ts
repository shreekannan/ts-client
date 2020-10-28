import { HashMap } from '../utilities/types';

/**
 * @hidden
 */
export interface PlaceMetadataComplete extends Partial<PlaceMetadata> {
    parent_id?: string;
}

export class PlaceMetadata {
    /** ID of the parent resource associated with the metadata */
    public readonly id: string;
    /** Name/ID of the zone metadata */
    public readonly name: string;
    /** Description of what this metadata represents */
    public readonly description: string;
    /** Metadata associated with this key. */
    public readonly details: HashMap | any[];
    /** List user groups allowed to edit the metadata */
    public readonly editors: readonly string [];

    constructor(data: PlaceMetadataComplete = {}) {
        this.id = data.id || data.parent_id || '';
        this.name = data.name || '';
        this.description = data.description || '';
        this.details = data.details || {};
        this.editors = data.editors || [];
    }
}
