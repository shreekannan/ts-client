
import { PlaceSystem } from '../systems/system';
import { HttpVerb } from '../http/interfaces';
import { PlaceResource } from '../resources/resource';
import { TriggerActions, TriggerConditions } from './interfaces';

/**
 * @hidden
 */
export interface PlaceTriggerComplete extends Partial<PlaceTrigger> {
    trigger_count?: number;
    control_system?: PlaceSystem;
}

export class PlaceTrigger extends PlaceResource {
    /** Name of the system assocaited with the trigger */
    public readonly system_name: string;
    /** Number of times the trigger has been activated/triggered */
    public readonly activated_count: number;
    /** Description of the trigger */
    public readonly description: string;
    /** Duration with which to ignore sequential activations of the trigger */
    public readonly debounce_period: number;
    /** Whether the trigger should take priority */
    public readonly important: boolean;
    /** Whether trigger is enabled on the associated zone or system */
    public readonly enabled: boolean;
    /** Whether the trigger can call webhooks */
    public readonly enable_webhook: boolean;
    /** Whether the trigger instance can execute methods */
    public readonly exec_enabled: boolean;
    /** Auth key for trigger's webhook */
    public readonly webhook_secret: string;
    /** HTTP verbs supported by the webhook */
    public readonly supported_methods: readonly HttpVerb[];
    /** ID of the system associated with the trigger */
    public readonly control_system_id: string;
    /** ID of the zone associated with the trigger */
    public readonly zone_id: string;

    /** ID of the system associated with the trigger */
    public get system_id(): string {
        return this.control_system_id;
    }

    /** Actions to perform when the trigger is activated */
    public get actions(): TriggerActions {
        const actions = this._actions;
        const fn_list = (actions.functions || []).map(i => ({
            ...i,
            args: { ...i.args },
        }));
        const mail_list = (actions.mailers || []).map(i => ({
            ...i,
            emails: [...i.emails],
        }));
        return { functions: fn_list, mailers: mail_list };
    }
    /** Conditions for activating the trigger */
    public get conditions(): TriggerConditions {
        const conditions = this._conditions;
        const cmp_list = (conditions.comparisons || []).map(i => ({
            ...i,
            left: typeof i.left === 'object' ? { ...i.left } : i.left,
            right: typeof i.right === 'object' ? { ...i.right } : i.right,
        }));
        const time_list = (conditions.time_dependents || []).map(i => ({
            ...i,
        }));
        return { comparisons: cmp_list, time_dependents: time_list };
    }

    /** Actions to perform when the trigger is activated */
    private _actions: TriggerActions;
    /** Conditions for activating the trigger */
    private _conditions: TriggerConditions;

    constructor(raw_data: PlaceTriggerComplete = {}) {
        super(raw_data);
        this.description = raw_data.description || '';
        this._actions = raw_data.actions || { functions: [], mailers: [] };
        this._conditions = raw_data.conditions || {
            comparisons: [],
            time_dependents: [],
        };
        this.debounce_period = raw_data.debounce_period || 0;
        this.important = raw_data.important || false;
        this.enabled = raw_data.enabled || false;
        this.webhook_secret = raw_data.webhook_secret || '';
        this.control_system_id =
            raw_data.system_id || raw_data.control_system_id || '';
        this.zone_id = raw_data.zone_id || '';
        this.system_name =
            raw_data.system_name ||
            (raw_data.control_system ? raw_data.control_system.name : '');
        this.enable_webhook = raw_data.enable_webhook || false;
        this.exec_enabled = raw_data.exec_enabled || false;
        this.supported_methods = raw_data.supported_methods || ['POST'];
        this.activated_count =
            raw_data.activated_count || raw_data.trigger_count || 0;
    }
}
