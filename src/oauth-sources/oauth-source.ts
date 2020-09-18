import { HashMap } from '../utilities/types';
import { PlaceResource } from '../resources/resource';

export class PlaceOAuthSource extends PlaceResource {
    /** ID of the authority associted with the auth method */
    public readonly authority_id: string;
    /** Application ID from the SSO provider providing the OAuth services */
    public readonly client_id: string;
    /** Application secret from the SSO provider providing the OAuth services */
    public readonly client_secret: string;
    /** Mapping of engine values to SSO provider values */
    public readonly info_mappings: HashMap<string>;
    /** HTTP URL of the SSO provider */
    public readonly site: string;
    /** URL from the SSO provider for authorisation */
    public readonly authorize_url: string;
    /** HTTP Method used to generating tokens */
    public readonly token_method: 'get' | 'post' | 'put';
    /** URL for generating user tokens */
    public readonly token_url: string;
    /** Scheme used to authenticate the user */
    public readonly auth_scheme: 'request_body' | 'basic_auth';
    /** Space seperated access scopes for the user */
    public readonly scope: string;
    /** URL to grab user's profile details with a valid token */
    public readonly raw_info_url: string;
    /** Additional params to be sent as part of the authorization reqest */
    public readonly authorize_params: HashMap<string>;
    /** Security checks to be made on the returned data */
    public readonly ensure_matching: HashMap<string[]>;

    constructor(raw_data: Partial<PlaceOAuthSource> = {}) {
        super(raw_data);
        this.authority_id = raw_data.authority_id || '';
        this.client_id = raw_data.client_id || '';
        this.client_secret = raw_data.client_secret || '';
        this.info_mappings = raw_data.info_mappings || {};
        this.authorize_params = raw_data.authorize_params || {};
        this.ensure_matching = raw_data.ensure_matching || {};
        this.site = raw_data.site || '';
        this.authorize_url = raw_data.authorize_url || 'oauth/authorize';
        this.token_method = raw_data.token_method || 'post';
        this.token_url = raw_data.token_url || 'oauth/token';
        this.auth_scheme = raw_data.auth_scheme || 'request_body';
        this.scope = raw_data.scope || '';
        this.raw_info_url = raw_data.raw_info_url || '';
        this.authorize_params = raw_data.authorize_params || {};
        this.ensure_matching = raw_data.ensure_matching || {};
    }
}
