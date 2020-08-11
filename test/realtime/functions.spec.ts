import { Subject } from 'rxjs';

import { HashMap } from '../../src/utilities/types';
import { PlaceResponse } from '../../src/realtime/interfaces';

import * as rxjs from 'rxjs/webSocket';
import * as Auth from '../../src/auth/functions';
import * as Utils from '../../src/utilities/general';
import * as mock_ws from '../../src/realtime/mock';
import * as ws from '../../src/realtime/functions';

jest.mock('../../src/auth/functions');

describe('Realtime API', () => {
    let fake_socket: Subject<any>;
    let another_fake_socket: Subject<any>;
    let ws_spy: jest.SpyInstance;
    let log_spy: jest.SpyInstance;
    let conn_spy: jest.SpyInstance;
    let count = 0;

    beforeEach(() => {
        jest.useFakeTimers();
        fake_socket = new Subject<any>();
        another_fake_socket = new Subject<any>();
        log_spy = jest.spyOn(Utils, 'log');
        (Auth as any).token = jest.fn().mockReturnValue('test');
        (Auth as any).apiEndpoint = jest.fn().mockReturnValue('/api/engine/v2');
        (Auth as any).isOnline = jest.fn().mockReturnValue(true);
        (Auth as any).isMock = jest.fn().mockReturnValue(false);
        (Auth as any).refreshAuthority = jest.fn().mockImplementation(async () => null);
        (Auth as any).invalidateToken = jest.fn().mockImplementation(async () => null);
        ws_spy = jest.spyOn(rxjs, 'webSocket');
        ws_spy
            .mockImplementationOnce(() => fake_socket)
            .mockImplementationOnce(() => another_fake_socket)
            .mockImplementation(() => fake_socket);
        ws.ignore({ sys: 'sys-A0', mod: 'mod', index: 1, name: 'power' });
        count++;
        conn_spy = jest.spyOn(ws, 'isConnected');
        conn_spy.mockReturnValue(true);
        jest.runOnlyPendingTimers();
    });

    afterEach(() => {
        count = 0;
        ws.cleanupRealtime();
        ws_spy.mockRestore();
        log_spy.mockRestore();
        conn_spy.mockRestore();
        jest.useRealTimers();
    });

    const test_method = (method: 'bind' | 'unbind' | 'debug' | 'ignore', done: () => void) => {
        const details = {
            sys: `sys-B0-${method}`,
            mod: 'mod',
            index: 1,
            name: 'power'
        };
        const post = jest.fn().mockImplementation(async () => null);
        let promise = (ws[method] as any)(details, post);
        expect(post).toHaveBeenCalledWith({
            id: ++count,
            cmd: method,
            ...details
        });
        // Test success
        promise.then(() => {
            post.mockImplementation(async () => {
                throw {
                    id: 2,
                    type: 'error',
                    code: 7,
                    msg: 'test error'
                } as PlaceResponse;
            });
            promise = (ws[method] as any)(details, post);
            expect(post).toHaveBeenCalledWith({
                id: ++count,
                cmd: method,
                ...details
            });
            // Test error
            promise.then(null, () => done());
        });
    };

    it('should handle bind request', done => test_method('bind', done));

    it('should handle unbind request', done => test_method('unbind', done));

    it('should handle debug request', done => test_method('debug', done));

    it('should handle ignore request', done => test_method('ignore', done));

    it('should handle exec request', done => {
        const details = {
            sys: 'sys-A3',
            mod: 'mod',
            index: 1,
            name: 'power',
            args: [true]
        };
        const result = { test: 1 };
        const post = jest.fn().mockImplementation(async () => result);
        let promise = (ws.execute as any)(details, post);
        expect(post).toHaveBeenCalledWith({
            id: ++count,
            cmd: 'exec',
            ...details
        });
        expect(promise).toBeInstanceOf(Promise);
        // Test success
        promise.then((resp: HashMap) => {
            expect(resp).toEqual(result);
            post.mockImplementation(async () => {
                throw {
                    id: 2,
                    type: 'error',
                    code: 7,
                    msg: 'test error'
                } as PlaceResponse;
            });
            promise = (ws.execute as any)(details, post);
            expect(post).toHaveBeenCalledWith({
                id: ++count,
                cmd: 'exec',
                ...details
            });
            // Test error
            promise.then(null, () => done());
        });
    });

    it('should handle notify responses', done => {
        const binding = { sys: 'sys-A2', mod: 'mod', index: 1, name: 'power' };
        ws.listen(binding).subscribe(value => {
            if (value) {
                expect(value).toBe('Yeah');
                done();
            }
        });
        fake_socket.next({
            type: 'notify',
            value: 'Yeah',
            meta: binding
        } as PlaceResponse);
    });

    it('should reconnect the websocket', done => {
        let actions = 0;
        ws.status().subscribe((connected: boolean) => {
            actions++;
            if (actions === 1) {
                // Websocket connected
                expect(connected).toBe(true);
                fake_socket.error({
                    status: 401,
                    message: 'Invalid auth token'
                });
                jest.runOnlyPendingTimers();
                jest.runOnlyPendingTimers();
            } else if (actions === 2) {
                // Websocket disconnected
                expect(connected).toBe(false);
                jest.runOnlyPendingTimers();
            } else if (actions === 3) {
                // Setup websocket
                expect(connected).toBe(true);
                done();
            }
        });
    });

    it('should allow to grab the current value of a binding', done => {
        const metadata = { sys: 'sys-A0', mod: 'mod', index: 1, name: 'power' };
        const post = jest.fn().mockImplementation(async () => null);
        expect(ws.value(metadata)).toBeUndefined();
        const promise = (ws as any).bind(metadata, post);
        promise.then(() => {
            fake_socket.next({
                type: 'notify',
                value: 'Yeah',
                meta: metadata
            } as PlaceResponse);
            expect(ws.value(metadata)).toBe('Yeah');
            done();
        });
        fake_socket.next({ id: 1, type: 'success' } as PlaceResponse);
    });

    it('should ping the websocket every X seconds', done => {
        fake_socket.subscribe((message: any) => {
            expect(message).toBe('ping');
            done();
        });
        jest.runOnlyPendingTimers();
    });

    it('should handle engine errors', () => {
        fake_socket.next({
            id: 0,
            type: 'error',
            code: 0,
            msg: 'test error'
        } as PlaceResponse);
        // fake_socket.next({ id: 1, type: 'error', code: 1, msg: 'test error' } as PlaceResponse);
        fake_socket.next({
            id: 2,
            type: 'error',
            code: 2,
            msg: 'test error'
        } as PlaceResponse);
        fake_socket.next({
            id: 3,
            type: 'error',
            code: 3,
            msg: 'test error'
        } as PlaceResponse);
        fake_socket.next({
            id: 4,
            type: 'error',
            code: 4,
            msg: 'test error'
        } as PlaceResponse);
        fake_socket.next({
            id: 5,
            type: 'error',
            code: 5,
            msg: 'test error'
        } as PlaceResponse);
        fake_socket.next({
            id: 6,
            type: 'error',
            code: 6,
            msg: 'test error'
        } as PlaceResponse);
        fake_socket.next({
            id: 7,
            type: 'error',
            code: 7,
            msg: 'test error'
        } as PlaceResponse);
        jest.advanceTimersByTime(10000);
        expect(log_spy).toBeCalledTimes(9);
    });

    it('should log error when engine message is invalid', () => {
        const message = {};
        fake_socket.next(message);
        expect(log_spy).toBeCalledWith('WS', 'Invalid websocket message', message, 'error');
    });

    it('should delay requests while reconnecting', done => {
        const metadata = { sys: 'sys-A0', mod: 'mod', index: 1, name: 'power' };
        another_fake_socket.subscribe((msg_str: string) => {
            if (msg_str !== 'ping' && typeof msg_str === 'string') {
                const expected: HashMap = { id: 1, cmd: 'bind', ...metadata };
                const message: HashMap = JSON.parse(msg_str);
                for (const key in message) {
                    if (message[key]) {
                        expect(message[key]).toBe(expected[key]);
                    }
                }
            }
        });
        (Auth as any).token.mockReturnValue('test');
        (ws.isConnected as any).mockReturnValue(false);
        ws.bind(metadata);
        jest.runOnlyPendingTimers();
        (ws.isConnected as any).mockReturnValue(true);
        another_fake_socket.next({ id: 1, type: 'success' } as PlaceResponse);
        jest.runOnlyPendingTimers();
        done();
    });

    it('should retry connecting if websocket fails to create', () => {
        // TODO
        expect(1).toBe(1);
    });

    it('should bind to mock system modules', done => {
        jest.useRealTimers();
        mock_ws.registerSystem('sys-A9', {
            Test: [
                {
                    test: 0,
                    $testCall() {
                        return (this as any)._system.Test[0].test++;
                    }
                }
            ]
        });
        ws.cleanupRealtime();
        jest.spyOn(Auth, 'isMock').mockReturnValue(true);
        const binding = { sys: 'sys-A9', mod: 'Test', index: 1, name: 'test' };
        ws.bind(binding).then(() => {
            ws.listen(binding).subscribe(value => {
                if (value) {
                    expect(ws.value(binding)).toBe(value);
                    expect(ws.value(binding)).toBe(10);
                    done();
                }
            });
            mock_ws.mockSystem('sys-A9').Test[0].test = 10;
        });
    });
});
