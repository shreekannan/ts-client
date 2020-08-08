import { of } from 'rxjs';

import { PlaceModuleBinding } from '../../src/realtime/module';
import { PlaceVariableBinding } from '../../src/realtime/status-variable';

import * as ws from '../../src/realtime/functions';

jest.mock('../../src/realtime/functions');

describe('PlaceSystemBinding', () => {
    let module: PlaceModuleBinding;
    let fake_system: any;

    beforeEach(() => {
        jest.useFakeTimers();
        (ws as any).status.mockImplementation(() => of(true));
        (ws as any).execute.mockImplementation(() => Promise.resolve());
        fake_system = { id: 'sys-A0' };
        module = new PlaceModuleBinding(fake_system, 'Test_1');
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should create an instance', () => {
        expect(module).toBeTruthy();
    });

    it('should expose system', () => {
        expect(module.system).toBe(fake_system);
    });

    it("should expose it's name and index", () => {
        expect(module.name).toBe('Test');
        expect(module.index).toBe(1);
        module = new PlaceModuleBinding(fake_system, '');
        expect(module.index).toBe(1);
    });

    it('should return bindings', () => {
        const binding = module.binding('test');
        expect(binding).toBeTruthy();
        expect(binding).toBeInstanceOf(PlaceVariableBinding);
        expect(module.binding('test')).toBe(binding);
    });

    it('should allow methods to be executed', () => {
        const promise = module.execute('testCall');
        expect(promise).toBeInstanceOf(Promise);
        expect(ws.execute).toBeCalledWith({
            sys: fake_system.id,
            mod: module.name,
            index: module.index,
            name: 'testCall',
            args: undefined,
        });
    });
});
