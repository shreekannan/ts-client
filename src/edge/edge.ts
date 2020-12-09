import { PlaceResource } from '../resources/resource';

export class PlaceEdge extends PlaceResource {

    public readonly description: string;

    public readonly secret: string;

    constructor(raw_data: Partial<PlaceEdge> = {}) {
        super(raw_data);
        this.description = raw_data.description || '';
        this.secret = raw_data.secret || '';
    }
}
