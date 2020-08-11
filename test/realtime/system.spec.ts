import { PlaceModuleBinding } from '../../src/realtime/module';
import { PlaceSystemBinding } from '../../src/realtime/system';

describe('PlaceSystemBinding', () => {
    let system: PlaceSystemBinding;

    beforeEach(() => {
        jest.useFakeTimers();
        system = new PlaceSystemBinding('sys-A0');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should create an instance', () => {
        expect(system).toBeTruthy();
    });

    it('should have an ID', () => {
        expect(system.id).toBe('sys-A0');
    });

    it('should return modules', () => {
        expect(() => system.module('')).toThrow();
        const test = system.module('Test');
        expect(test).toBeInstanceOf(PlaceModuleBinding);
        expect(test).toBe(system.module('Test'));
        expect(test).toBe(system.module('Test_1'));
        expect(test).toBe(system.module('Test', -1));
        expect(test).not.toBe(system.module('Test', 2));
    });
});
