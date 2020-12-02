import { PlaceResource } from '../resources/resource';
import { HashMap } from '../utilities/types';

export interface PlaceSamlRequestAttribute {
    name: string;
    name_format: string;
    friendly_name: string;
}

export class PlaceSAMLSource extends PlaceResource {
    /** Type of auth source */
    public readonly type = 'saml';
    /** ID of the authority associted with the auth method */
    public readonly authority_id: string;
    /** Name of the application requesting auth */
    public readonly issuer: string;
    /**
     * Mapping of request params that exist during the request
     * phase of OmniAuth that should to be sent to the IdP
     */
    public readonly idp_sso_target_url_runtime_params: HashMap<string>;
    /** Describes the format of the username required by this application */
    public readonly name_identifier_format: string;
    /** Attribute that uniquely identifies the user */
    public readonly uid_attribute: string;
    /** URL at which the SAML assertion should be received (SSO Service => Place URL) */
    public readonly assertion_consumer_service_url: string;
    /** URL to which the authentication request should be sent (Place => SSO Service) */
    public readonly idp_sso_target_url: string;
    /** Identity provider's certificate in PEM format (this or fingerprint is required) */
    public readonly idp_cert: string;
    /** SHA1 fingerprint of the certificate */
    public readonly idp_cert_fingerprint: string;
    /** Name for the attribute service */
    public readonly attribute_service_name: string;
    /** Mapping of Attribute Names in a SAMLResponse to entries in the OmniAuth info hash */
    public readonly attribute_statements: HashMap<string[]>;
    /** Mapping of Attribute Names in a SAMLResponse to entries in the OmniAuth info hash */
    public readonly request_attributes: PlaceSamlRequestAttribute[];
    /** URL to which the single logout request and response should be sent */
    public readonly idp_slo_target_url: string;
    /** Value to use as default RelayState for single log outs */
    public readonly slo_default_relay_state: string;

    constructor(raw_data: Partial<PlaceSAMLSource> = {}) {
        super(raw_data);
        this.authority_id = raw_data.authority_id || '';
        this.issuer = raw_data.issuer || '';
        this.idp_sso_target_url_runtime_params =
            raw_data.idp_sso_target_url_runtime_params || {};
        this.name_identifier_format = raw_data.name_identifier_format || '';
        this.uid_attribute = raw_data.uid_attribute || '';
        this.assertion_consumer_service_url =
            raw_data.assertion_consumer_service_url || '';
        this.idp_sso_target_url = raw_data.idp_sso_target_url || '';
        this.idp_cert = raw_data.idp_cert || '';
        this.idp_cert_fingerprint = raw_data.idp_cert_fingerprint || '';
        this.attribute_service_name = raw_data.attribute_service_name || '';
        this.attribute_statements = raw_data.attribute_statements || {};
        this.request_attributes = raw_data.request_attributes || [];
        this.idp_slo_target_url = raw_data.idp_slo_target_url || '';
        this.slo_default_relay_state = raw_data.slo_default_relay_state || '';
    }
}
