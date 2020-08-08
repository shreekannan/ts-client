import { HashMap } from '../utilities/types';
import { PlaceResource } from '../resources/resource';

export class PlaceApplication extends PlaceResource {
    /** Unique identifier of the application */
    public readonly uid: string;
    /** Secret associated with the application */
    public readonly secret: string;
    /** ID of the domain that owns this application */
    public readonly owner_id: string;
    /** Access scopes required by users to access the application */
    public readonly scopes: string;
    /** Authentication redirect URI */
    public readonly redirect_uri: string;
    /** Skip authorization checks for the application */
    public readonly skip_authorization: boolean;

    constructor(raw_data: HashMap = {}) {
        super(raw_data);
        this.uid = raw_data.uid || '';
        this.secret = raw_data.secret || '';
        this.owner_id = raw_data.owner_id || '';
        this.scopes = raw_data.scopes || '';
        this.redirect_uri = raw_data.redirect_uri || '';
        this.skip_authorization = raw_data.skip_authorization || false;
    }
}
