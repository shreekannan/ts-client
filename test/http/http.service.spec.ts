import { HttpError } from '../../src/http/http.interfaces';

jest.mock('../../src/auth/auth.service');

import { of } from 'rxjs';
import * as Auth from '../../src/auth/auth.service';
import * as Http from '../../src/http/http.service';

describe('Http', () => {
    beforeEach(() => {
        (Auth as any).refreshAuthority = jest.fn(() => Promise.resolve());
        (Auth as any).invalidateToken = jest.fn(() => Promise.resolve());
        (Auth as any).has_token = jest.fn();
        (Auth as any).has_token.mockReturnValue(true);
    });

    it('should refresh auth on 401 errors on GET and DELETE requests', async () => {
        expect.assertions(4);
        window.fetch = jest.fn().mockImplementation(async () => ({
            status: 400,
            text: () => Promise.resolve('Bad Request')
        }));
        await Http.get('_')
            .toPromise()
            .catch(_ => {
                expect(Auth.refreshAuthority).not.toBeCalled();
            });
        (Auth as any).has_token.mockReturnValue(false);
        window.fetch = jest.fn().mockImplementation(async () => ({
            status: 401,
            text: () => Promise.resolve('Unauthorised')
        }));
        await Http.get('_')
            .toPromise()
            .catch(_ => _);
        expect(Auth.refreshAuthority).toBeCalled();
        (Auth as any).has_token.mockReturnValue(true);
        await Http.get('_')
            .toPromise()
            .catch(_ => {
                expect(Auth.invalidateToken).toHaveBeenCalledTimes(2);
                expect(Auth.refreshAuthority).toHaveBeenCalledTimes(2);
            });
        (window.fetch as any).mockReset();
        (window.fetch as any).mockRestore();
    });

    it('should expose response headers', () => {
        expect(Http.responseHeaders('/test')).toEqual({});
    });

    describe('GET', () => {
        beforeEach(() => {
            (Auth as any).has_token.mockReturnValue(true);
            window.fetch = jest.fn().mockImplementation(
                async () =>
                    ({
                        status: 200,
                        ok: true,
                        json: async () => ({ message: 'GET Received!!!' }),
                        text: async () => 'GET Received!!!',
                        headers: { 'Authorisation': 'test', 'x-total-count': 100 }
                    } as any)
            );
            jest.useFakeTimers();
        });

        afterEach(() => {
            (window.fetch as any).mockReset();
            (window.fetch as any).mockRestore();
            jest.useRealTimers();
        });

        it('should allow GET requests', done => {
            expect.assertions(2);
            Http.get('test_url').subscribe(data => {
                expect(data).toEqual({ message: 'GET Received!!!' });
                done();
            });
            expect(window.fetch).toHaveBeenCalled();
            (Http as any).get('', undefined, (...args: any[]) => of());
        });

        it('should allow returning text data', done => {
            expect.assertions(2);
            Http.get('test_url', { response_type: 'text' }).subscribe(data => {
                expect(data).toBe('GET Received!!!');
                done();
            });
            expect(window.fetch).toHaveBeenCalled();
            jest.runOnlyPendingTimers();
        });

        it('should allow custom headers', () => {
            expect.assertions(1);
            Http.get('test_url', { headers: { 'CUSTOM-HEADER-X': 'Trump Cards :)' } }).subscribe(
                _ => null
            );
            expect(window.fetch).toHaveBeenCalled();
        });

        it('should handle errors', done => {
            expect.assertions(1);
            (window.fetch as any).mockImplementation(async () => ({
                status: 400,
                text: async () => 'Bad Request'
            }));
            Http.get('_').subscribe(
                _ => null,
                err => {
                    expect(err).toEqual({ status: 400, message: 'Bad Request' });
                    done();
                }
            );
            jest.runOnlyPendingTimers();
        });
    });

    describe('POST', () => {
        beforeEach(() => {
            (Auth as any).has_token.mockReturnValue(true);
            window.fetch = jest.fn().mockImplementation(
                async () =>
                    ({
                        status: 200,
                        ok: true,
                        json: async () => ({ message: 'POST Received!!!' }),
                        text: async () => 'POST Received!!!',
                        headers: { 'Authorisation': 'test', 'x-total-count': 100 }
                    } as any)
            );
            jest.useFakeTimers();
        });

        afterEach(() => {
            (window.fetch as any).mockReset();
            (window.fetch as any).mockRestore();
            jest.useRealTimers();
        });

        it('should allow requests', done => {
            expect.assertions(2);
            Http.post('test_url', 'test_body').subscribe(data => {
                expect(data).toEqual({ message: 'POST Received!!!' });
                done();
            });
            expect(window.fetch).toHaveBeenCalled();
            (Http as any).post('', '', undefined, (...args: any[]) => of());
        });

        it('should allow returning text data', done => {
            expect.assertions(2);
            Http.post('test_url', 'test_body', { response_type: 'text' }).subscribe(data => {
                expect(data).toBe('POST Received!!!');
                done();
            });
            expect(window.fetch).toHaveBeenCalled();
        });

        it('should allow custom headers', () => {
            expect.assertions(1);
            Http.post('test_url', 'test_body', {
                headers: { 'CUSTOM-HEADER-X': 'Trump Cards :)' }
            }).subscribe(_ => null);
            expect(window.fetch).toHaveBeenCalled();
        });

        it('should handle errors', done => {
            expect.assertions(1);
            (window.fetch as any).mockImplementation(async () => ({
                status: 400,
                text: () => Promise.resolve('Bad Request')
            }));
            Http.post('_', '').subscribe(
                _ => null,
                err => {
                    expect(err).toEqual({ status: 400, message: 'Bad Request' });
                    done();
                }
            );
            jest.runOnlyPendingTimers();
        });
    });

    describe('PUT', () => {
        beforeEach(() => {
            (Auth as any).has_token.mockReturnValue(true);
            window.fetch = jest.fn().mockImplementation(
                async () =>
                    ({
                        status: 200,
                        ok: true,
                        json: async () => ({ message: 'PUT Received!!!' }),
                        text: async () => 'PUT Received!!!',
                        headers: { 'Authorisation': 'test', 'x-total-count': 100 }
                    } as any)
            );
            jest.useFakeTimers();
        });

        afterEach(() => {
            (window.fetch as any).mockReset();
            (window.fetch as any).mockRestore();
            jest.useRealTimers();
        });

        it('should allow requests', done => {
            expect.assertions(2);
            Http.put('test_url', 'test_body').subscribe(data => {
                expect(data).toEqual({ message: 'PUT Received!!!' });
                done();
            });
            expect(window.fetch).toHaveBeenCalled();
            jest.runOnlyPendingTimers();
            (Http as any).put('', '', undefined, (...args: any[]) => of());
        });

        it('should handle errors', done => {
            expect.assertions(1);
            (window.fetch as any).mockImplementation(async () => ({
                status: 400,
                text: async () => 'Bad Request'
            }));
            Http.put('_', '').subscribe(
                _ => null,
                err => {
                    expect(err).toEqual({ status: 400, message: 'Bad Request' });
                    done();
                }
            );
            jest.runOnlyPendingTimers();
        });
    });

    describe('PATCH', () => {
        beforeEach(() => {
            (Auth as any).has_token.mockReturnValue(true);
            window.fetch = jest.fn().mockImplementation(
                async () =>
                    ({
                        status: 200,
                        ok: true,
                        json: async () => ({ message: 'PATCH Received!!!' }),
                        text: async () => 'PATCH Received!!!',
                        headers: { 'Authorisation': 'test', 'x-total-count': 100 }
                    } as any)
            );
            jest.useFakeTimers();
        });

        afterEach(() => {
            (window.fetch as any).mockReset();
            (window.fetch as any).mockRestore();
            jest.useRealTimers();
        });

        it('should allow requests', done => {
            expect.assertions(2);
            Http.patch('test_url', 'test_body').subscribe((data: any) => {
                expect(data).toEqual({ message: 'PATCH Received!!!' });
                done();
            });
            expect(window.fetch).toHaveBeenCalled();
            jest.runOnlyPendingTimers();
            (Http as any).patch('', '', undefined, (...args: any[]) => of());
        });

        it('should handle errors', done => {
            expect.assertions(1);
            (window.fetch as any).mockImplementation(async () => ({
                status: 400,
                text: async () => 'Bad Request'
            }));
            Http.patch('_', '').subscribe(
                (_: any) => null,
                (err: HttpError) => {
                    expect(err).toEqual({ status: 400, message: 'Bad Request' });
                    done();
                }
            );
            jest.runOnlyPendingTimers();
        });
    });

    describe('DELETE', () => {
        beforeEach(() => {
            (Auth as any).has_token.mockReturnValue(true);
            window.fetch = jest.fn().mockImplementation(
                async () =>
                    ({
                        status: 200,
                        ok: true,
                        json: async () => undefined,
                        text: async () => '',
                        headers: { 'Authorisation': 'test', 'x-total-count': 100 }
                    } as any)
            );
            jest.useFakeTimers();
        });

        afterEach(() => {
            (window.fetch as any).mockReset();
            (window.fetch as any).mockRestore();
            jest.useRealTimers();
        });

        it('should allow requests', done => {
            expect.assertions(2);
            Http.del('test_url').subscribe((data: any) => {
                expect(data).toBeUndefined();
                done();
            });
            expect(window.fetch).toHaveBeenCalled();
            (Http as any).del('', undefined, (...args: any[]) => of());
        });

        it('should allow returning json data', async () => {
            expect.assertions(2);
            const data = await Http.del('test_url', { response_type: 'json' }).toPromise();
            expect(data).toBeUndefined();
            expect(window.fetch).toHaveBeenCalled();
            jest.runOnlyPendingTimers();
        });

        it('should allow returning text data', async () => {
            expect.assertions(2);
            const data = await Http.del('test_url', { response_type: 'json' }).toPromise();
            expect(data).toBeUndefined();
            expect(window.fetch).toHaveBeenCalled();
            jest.runOnlyPendingTimers();
        });

        it('should handle errors', done => {
            expect.assertions(1);
            (window.fetch as any).mockImplementation(async () => ({
                status: 400,
                text: async () => 'Bad Request'
            }));
            Http.del('_').subscribe(
                (_: any) => null,
                (err: HttpError) => {
                    expect(err).toEqual({ status: 400, message: 'Bad Request' });
                    done();
                }
            );
            jest.runOnlyPendingTimers();
        });
    });
});
