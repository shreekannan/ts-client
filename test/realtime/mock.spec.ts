import {
    deregisterSystem,
    mockSystem,
    registerSystem,
} from '../../src/realtime/mock';

import { first } from 'rxjs/operators';
import * as Auth from '../../src/auth/functions';
import * as ws from '../../src/realtime/functions';

describe('MockEngineWebsocket', () => {
    beforeEach(() => {
        jest.spyOn(Auth, 'isMock').mockReturnValue(true);
        jest.spyOn(Auth, 'authority').mockReturnValue({} as any);
        registerSystem('sys-A0', {
            Test: [
                {
                    test: 10,
                    $testCall() {
                        setTimeout(() => (this.test += 1));
                        return this.test;
                    },
                },
            ],
        });
    });

    afterEach(() => {
        deregisterSystem('sys-A0');
        ws.cleanupRealtime();
    });

    it('should bind to mock system modules', done => {
        const binding = { sys: 'sys-A0', mod: 'Test', index: 1, name: 'test' };
        ws.listen(binding).subscribe(value => {
            if (value) {
                expect(ws.value(binding)).toBe(10);
                done();
            }
        });
        ws.bind(binding);
    });

    it('post binding value updates', done => {
        const binding = { sys: 'sys-A0', mod: 'Test', index: 1, name: 'test' };
        let count = 0;
        ws.listen(binding).subscribe(value => {
            if (count === 0) {
                expect(value).toBeNull();
                count++;
            } else {
                expect(value).toBe(10);
                done();
            }
        });
        ws.bind(binding);
    });

    it('should unbind from mock system modules', done => {
        const binding = { sys: 'sys-A0', mod: 'Test', index: 1, name: 'test' };
        ws.listen(binding).subscribe(value => {
            if (value) {
                expect(ws.value(binding)).toBe(10);
                ws.unbind(binding).then(() => {
                    mockSystem('sys-A0').Test[0].test = 20;
                    setTimeout(() => {
                        expect(ws.value(binding)).not.toBe(20);
                        done();
                    }, 200);
                });
            }
        });
        ws.bind(binding);
    });

    it('should exec mock system module methods', done => {
        const binding = { sys: 'sys-A0', mod: 'Test', index: 1, name: 'test' };
        ws.listen(binding)
            .pipe(first(_ => _))
            .subscribe(_ => {
                ws.execute({ ...binding, name: 'testCall' }).then(value => {
                    expect(value).toBe(10);
                    setTimeout(() => {
                        expect(ws.value(binding)).toBe(11);
                        done();
                    }, 200);
                });
            });
        ws.bind(binding);
    });

    it('should error if binding module not found', done => {
        const binding = {
            sys: 'sys-A0',
            mod: 'Testing',
            index: 1,
            name: 'test',
        };
        ws.bind(binding).then(null, () => done());
    });

    it('should error if binding system not found', done => {
        const binding = { sys: 'sys-B0', mod: 'Test', index: 1, name: 'test' };
        ws.bind(binding).then(null, () => done());
    });
});
