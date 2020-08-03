import { getModule, getSystem } from '../../src/websocket/binding.service';
import { PlaceModuleBinding } from '../../src/websocket/classes/engine-module.class';
import { PlaceSystemBinding } from '../../src/websocket/classes/engine-system.class';

describe('PlaceBindingService', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should allow getting systems', () => {
        const system = getSystem('sys-A0');
        expect(system).toBeInstanceOf(PlaceSystemBinding);
        expect(system.id).toBe('sys-A0');
    });

    it('should allow getting modules', () => {
        const module = getModule('sys-A0', 'Test');
        expect(module).toBeInstanceOf(PlaceModuleBinding);
        expect(module.id).toBe('Test_1');
        expect(module.name).toBe('Test');
        expect(module.index).toBe(1);
    });
});
