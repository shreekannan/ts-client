
import { PlaceTrigger } from '../../../../src/http/services/triggers/trigger.class';
import {
    TriggerActions,
    TriggerConditionOperator,
    TriggerConditions,
    TriggerTimeConditionType
} from '../../../../src/http/services/triggers/trigger.interfaces';

describe('PlaceTrigger', () => {
    let trigger: PlaceTrigger;
    let service: any;
    const actions: TriggerActions = {
        functions: [{ mod: 'mod-42', method: 'meaning', args: { purpose: 'what' } }],
        mailers: [{ emails: ['support@placeos.net'], content: 'Here be some contents' }]
    };
    const conditions: TriggerConditions = {
        comparisons: [],
        time_dependents: [{ type: TriggerTimeConditionType.AT, time: 0 }],
    };

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        };
        trigger = new PlaceTrigger({
            id: 'tri-test',
            control_system_id: 'sys-42',
            description: 'In a galaxy far far away...',
            debounce_period: 1000,
            important: true,
            enabled: true,
            activated_count: 22,
            settings: { today: false, future: 'Yeah!' },
            created_at: 999,
            actions,
            conditions
        });
    });

    it('should create instance', () => {
        expect(trigger).toBeTruthy();
        expect(trigger).toBeInstanceOf(PlaceTrigger);
    });

    it('should expose system id', () => {
        expect(trigger.system_id).toBe('sys-42');
    });

    it('should expose description', () => {
        expect(trigger.description).toBe('In a galaxy far far away...');
    });

    it('should expose debounce period', () => {
        expect(trigger.debounce_period).toBe(1000);
    });

    it('should expose important', () => {
        expect(trigger.important).toBe(true);
    });

    it('should expose enabled', () => {
        expect(trigger.enabled).toBe(true);
    });

    it('should expose activation count', () => {
        expect(trigger.activated_count).toBe(22);
    });

    it('should expose actions', () => {
        expect(trigger.actions).toEqual(actions);
    });

    it('should expose conditions', () => {
        expect(trigger.conditions).toEqual(conditions);
    });

    it('should have default values', () => {
        trigger = new PlaceTrigger({});
        expect(trigger.actions).toBeInstanceOf(Object);
        expect(trigger.conditions).toBeInstanceOf(Object);
        trigger = new PlaceTrigger({ actions: {}, conditions: {} });
        expect(trigger.actions).toBeInstanceOf(Object);
        expect(trigger.conditions).toBeInstanceOf(Object);
    });
});
