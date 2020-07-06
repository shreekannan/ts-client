import { HashMap } from '../../../utilities/types.utilities';
import { EngineZone } from '../zones/zone.class';
import { PlaceMetadata } from './metadata.class';

export class PlaceZoneMetadata {
    /** Zone associated with the metadata */
    public readonly zone: EngineZone;
    /** Metadata for zone */
    public readonly metadata: HashMap<PlaceMetadata>;
    /** List of the root keys in the metadata */
    public readonly keys: string[];

    constructor(data: HashMap = {}) {
        this.zone = new EngineZone(data.zone);
        this.keys = data.keys || [];
        this.metadata = {};
        const metadata = data.metadata || {};
        for (const key of this.keys) {
            this.metadata[key] = new PlaceMetadata(metadata[key]);
        }
    }
}
