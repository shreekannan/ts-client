import { BehaviorSubject } from 'rxjs';

import { PlaceVariableBinding } from '../../../src/websocket/classes/engine-status-variable.class';

jest.mock('../../../src/websocket/websocket.class');

import * as ws from '../../../src/websocket/websocket.class';

describe('PlaceVariableBinding', () => {
    let status: PlaceVariableBinding;
    let fake_module: any;
    let fake_system: any;
    let state_subject: BehaviorSubject<boolean>;
    let status_value: BehaviorSubject<number>;

    beforeEach(() => {
        jest.useFakeTimers();
        state_subject = new BehaviorSubject<boolean>(false);
        status_value = new BehaviorSubject<any>(undefined);
        (ws as any).status.mockImplementation(() => state_subject.asObservable());
        (ws as any).bind.mockImplementation((_: any) => Promise.resolve());
        (ws as any).unbind.mockImplementation((_: any) => Promise.resolve());
        (ws as any).listen.mockImplementation(() => status_value.asObservable());
        (ws as any).value.mockImplementation((_: any) => status_value.getValue());
        fake_system = { id: 'sys-A0' };
        fake_module = { system: fake_system, name: 'Test', index: 1 };
        status = new PlaceVariableBinding(fake_module, 'test');
    });

    afterEach(() => {
        (ws.bind as any).mockRestore();
        jest.useRealTimers();
    });

    it('should create an instance', () => {
        expect(status).toBeTruthy();
    });

    it('should expose it name', () => {
        expect(status.name).toBe('test');
    });

    it('should bind to the status variable', done => {
        jest.useRealTimers();
        const unbind = status.bind();
        expect(unbind).toBeInstanceOf(Function);
        expect(ws.bind).toBeCalled();
        setTimeout(() => {
            expect(status.count).toBe(1);
            done();
        });
    });

    it('should unbind to the status variable', done => {
        jest.useRealTimers();
        status.bind();
        const unbind = status.bind();
        setTimeout(() => {
            expect(status.count).toBe(2);
            unbind();
            setTimeout(() => {
                expect(status.count).toBe(1);
                status.unbind();
                setTimeout(() => {
                    expect(status.count).toBe(0);
                    expect(ws.unbind).toBeCalledTimes(1);
                    // Check that the binding count doesn't go below 0
                    status.unbind();
                    setTimeout(() => {
                        expect(status.count).toBe(0);
                        done();
                    });
                });
            });
        });
    });

    it('should expose the binding value', () => {
        expect(status.value).toBeUndefined();
        status_value.next(10);
        expect(status.value).toBe(10);
    });

    it('should allow for subscribing to the binding value', done => {
        status.listen().subscribe(value => {
            if (value) {
                expect(value).toBe(10);
                done();
            }
        });
        status_value.next(10);
    });

    it('should rebind to bindings on websocket reconnect', done => {
        jest.useRealTimers();
        state_subject.next(true);
        state_subject.next(false);
        setTimeout(() => {
            expect(ws.bind).not.toBeCalled();
            status.bind();
            setTimeout(() => {
                state_subject.next(false);
                state_subject.next(true);
                setTimeout(() => {
                    expect(ws.bind).toBeCalled();
                    done();
                });
            });
        });
    });
});
