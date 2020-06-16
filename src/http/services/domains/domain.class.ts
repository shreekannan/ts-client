import { HashMap } from '../../../utilities/types.utilities';
import { EngineResource } from '../resources/resource.class';
import { EngineDomainsService } from './domains.service';

export const DOMAIN_MUTABLE_FIELDS = ['name', 'domain', 'login_url', 'logout_url', 'description', 'config', 'internals'] as const;
type DomainMutableTuple = typeof DOMAIN_MUTABLE_FIELDS;
export type DomainMutableFields = DomainMutableTuple[number];

export class EngineDomain extends EngineResource<EngineDomainsService> {
    /** Domain name */
    public readonly domain: string;
    /** Login URL for the domain */
    public readonly login_url: string;
    /** Logout URL for the domain */
    public readonly logout_url: string;
    /** Description of the domain domain */
    public readonly description: string;
    /** Local configuration for the domain */
    public readonly config: string;
    /** Internal settings for the domain */
    public readonly internals: string;
    /** Class type of required service */
    protected __type: string = 'EngineDomain';

    constructor(raw_data: HashMap = {}) {
        super(raw_data);
        this.description = raw_data.description || '';
        this.domain = raw_data.domain || raw_data.dom || '';
        this.login_url = raw_data.login_url || '';
        this.logout_url = raw_data.logout_url || '';
        this.config = raw_data.config || '{}';
        this.internals = raw_data.internals || '{}';
    }

    public storePendingChange(
        key: DomainMutableFields,
        value: EngineDomain[DomainMutableFields]
    ): this {
        return super.storePendingChange(key as any, value);
    }

    public toJSON(this: EngineDomain, with_changes: boolean = true): HashMap {
        const obj = super.toJSON(with_changes);
        if (this.config) {
            obj.config = JSON.parse(this.config);
        }
        if (this.internals) {
            obj.internals = JSON.parse(this.internals);
        }
        return obj;
    }
}
