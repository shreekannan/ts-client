import { HashMap } from '../../../utilities/types.utilities';
import { EngineResource } from '../resources/resource.class';
import { PlaceMQTTBrokerService } from './brokers.service';

export const BROKER_MUTABLE_FIELDS = [
    'name',
    'auth_type',
    'description',
    'host',
    'port',
    'tls',
    'username',
    'password',
    'certificate',
    'secret',
    'filters'
] as const;
type BrokerMutableTuple = typeof BROKER_MUTABLE_FIELDS;
export type BrokerMutableFields = BrokerMutableTuple[number];

export enum AuthType {
    Certificate,
    NoAuth,
    UserPassword
}

export class PlaceMQTTBroker extends EngineResource<PlaceMQTTBrokerService> {
    public readonly auth_type: AuthType;
    /** Details of the Broker */
    public readonly description: string;
    /** Host name of the Broker endpoint */
    public readonly host: string;
    /** Port number of the Broker endpoint */
    public readonly port: number;
    /** Whether connection to the Broker endpoint has TLS */
    public readonly tls: boolean;
    /** Username to use for connecting to Broker */
    public readonly username: string;
    /** Password to use for connecting to Broker */
    public readonly password: string;
    /**  */
    public readonly certificate: string;
    /**  */
    public readonly secret: string;
    /**  */
    public readonly filters: string[];

    constructor(data: HashMap = {}) {
        super();
        this.auth_type = data.auth_type || AuthType.UserPassword;
        this.description = data.description || '';
        this.host = data.host || '';
        this.port = data.port || 1883;
        this.tls = data.tls || false;
        this.username = data.username || '';
        this.password = data.password || '';
        this.certificate = data.certificate || '';
        this.secret = data.secret || '';
        this.filters = data.filters || [];
    }

    public storePendingChange(
        key: BrokerMutableFields,
        value: PlaceMQTTBroker[BrokerMutableFields]
    ): this {
        return super.storePendingChange(key as any, value);
    }
}
