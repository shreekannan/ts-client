import { PlaceTrigger } from '../../src/triggers/trigger';
import {
    TriggerActions,
    TriggerConditionOperator,
    TriggerConditions,
    TriggerTimeConditionType,
} from '../../src/triggers/interfaces';

describe('PlaceTrigger', () => {
    let trigger: PlaceTrigger;
    const actions: TriggerActions = {
        functions: [
            { mod: 'mod-42', method: 'meaning', args: { purpose: 'what' } },
        ],
        mailers: [
            {
                emails: ['support@placeos.net'],
                content: 'Here be some contents',
            },
        ],
    };
    const conditions: TriggerConditions = {
        comparisons: [
            { left: '', operator: TriggerConditionOperator.EQ, right: '2' },
            {
                left: { mod: '1', status: 'he', keys: [] },
                operator: TriggerConditionOperator.EQ,
                right: { mod: '2', status: 'con', keys: [] },
            },
        ],
        time_dependents: [{ type: TriggerTimeConditionType.AT, time: 0 }],
    };

    beforeEach(() => {
        trigger = new PlaceTrigger({
            id: 'tri-test',
            control_system_id: 'sys-42',
            description: 'In a galaxy far far away...',
            debounce_period: 1000,
            important: true,
            enabled: true,
            activated_count: 22,
            control_system: { name: 'John' } as any,
            created_at: 999,
            actions,
            conditions,
        });
    });

    it('should create instance', () => {
        expect(trigger).toBeTruthy();
        expect(trigger).toBeInstanceOf(PlaceTrigger);
        expect(new PlaceTrigger()).toBeInstanceOf(PlaceTrigger);
    });

    it('should expose properties', () => {
        expect(trigger.system_id).toBe('sys-42');
        expect(trigger.description).toBe('In a galaxy far far away...');
        expect(trigger.debounce_period).toBe(1000);
        expect(trigger.important).toBe(true);
        expect(trigger.enabled).toBe(true);
        expect(trigger.system_name).toBe('John');
        expect(trigger.activated_count).toBe(22);
        expect(trigger.actions).toEqual(actions);
        expect(trigger.conditions).toEqual(conditions);
    });

    it('should have default values', () => {
        trigger = new PlaceTrigger({});
        expect(trigger.actions).toBeInstanceOf(Object);
        expect(trigger.conditions).toBeInstanceOf(Object);
        trigger = new PlaceTrigger({ actions: {}, conditions: {} } as any);
        expect(trigger.actions).toBeInstanceOf(Object);
        expect(trigger.conditions).toBeInstanceOf(Object);
    });
});
