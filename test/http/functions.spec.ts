import { HttpError } from '../../src/http/interfaces';

import { of } from 'rxjs';

import * as Auth from '../../src/auth/functions';
import * as Http from '../../src/http/functions';

jest.mock('../../src/auth/functions');

describe('Http', () => {
    beforeEach(() => {
        (Auth as any).refreshAuthority = jest.fn(() => Promise.resolve());
        (Auth as any).invalidateToken = jest.fn(() => Promise.resolve());
        (Auth as any).hasToken = jest.fn();
        (Auth as any).hasToken.mockReturnValue(true);
        (Auth as any).listenForToken = jest.fn(() => of(true, false, true));
        (Auth as any).hasToken.mockReturnValue(true);
        window.fetch = jest.fn().mockImplementation(
            async () =>
                ({
                    status: 200,
                    ok: true,
                    json: async () => ({ message: 'MSG Received!!!' }),
                    text: async () => 'MSG Received!!!',
                    headers: {
                        Authorisation: 'test',
                        'x-total-count': 100,
                    },
                } as any)
        );
        jest.useFakeTimers();
    });

    afterEach(() => {
        (window.fetch as any).mockReset();
        (window.fetch as any).mockRestore();
        jest.useRealTimers();
    });

    it('should handle non 401 errors', async () => {
        expect.assertions(2);
        window.fetch = jest.fn().mockImplementation(async () => ({
            status: 400,
            text: () => Promise.resolve('Bad Request'),
        }));
        await Http.request('GET', '_', {})
            .toPromise()
            .catch((error) => {
                expect(Auth.refreshAuthority).not.toBeCalled();
                expect(error.status).toBe(400);
            });
    });

    it('should refresh auth on 401 errors', async () => {
        expect.assertions(1);
        window.fetch = jest
            .fn()
            .mockImplementation(async () => ({
                status: 200,
                text: async () => 'Success',
                json: async () => {},
            }))
            .mockImplementationOnce(async () => ({
                status: 401,
                text: async () => 'Unauthorised',
            }));
        (Auth as any).listenForToken = jest.fn(() => of(true, false, true));
        setTimeout(() => (Auth as any).hasToken.mockReturnValue(true), 500);
        await Http.request('GET', '_', {})
            .toPromise()
            .catch((_) => _);
        expect(Auth.refreshAuthority).toBeCalled();
    });

    it('should expose response headers', () => {
        expect(Http.responseHeaders('/test')).toEqual({});
    });

    it('should allow GET requests', (done) => {
        expect.assertions(2);
        Http.get('test_url').subscribe((data) => {
            expect(data).toEqual({ message: 'MSG Received!!!' });
            done();
        });
        expect(window.fetch).toHaveBeenCalled();
        (Http as any).get('', undefined, () => of());
    });

    it('should allow returning text data for GET', (done) => {
        expect.assertions(2);
        Http.get('test_url', { response_type: 'text' }).subscribe((data) => {
            expect(window.fetch).toHaveBeenCalled();
            expect(data).toBe('MSG Received!!!');
            done();
        });
        jest.runOnlyPendingTimers();
    });

    it('should allow custom headers for GET', () => {
        expect.assertions(1);
        Http.get('test_url', {
            headers: { 'CUSTOM-HEADER-X': 'Trump Cards :)' },
        }).subscribe((_) => null);
        expect(window.fetch).toHaveBeenCalled();
    });

    it('should handle GET errors ', (done) => {
        expect.assertions(1);
        (window.fetch as any).mockImplementation(async () => ({
            status: 400,
            text: async () => 'Bad Request',
        }));
        Http.get('_').subscribe(
            (_) => null,
            (err) => {
                expect(err.status).toBe(400);
                done();
            }
        );
        jest.runOnlyPendingTimers();
    });

    it('should allow POST requests', (done) => {
        expect.assertions(2);
        Http.post('test_url', 'test_body').subscribe((data) => {
            expect(data).toEqual({ message: 'MSG Received!!!' });
            done();
        });
        expect(window.fetch).toHaveBeenCalled();
        (Http as any).post('', '', undefined, () => of());
    });

    it('should allow returning POST text data', (done) => {
        expect.assertions(2);
        Http.post('test_url', 'test_body', {
            response_type: 'text',
        }).subscribe((data) => {
            expect(data).toBe('MSG Received!!!');
            done();
        });
        expect(window.fetch).toHaveBeenCalled();
    });

    it('should allow custom headers on POST', () => {
        expect.assertions(1);
        Http.post('test_url', 'test_body', {
            headers: { 'CUSTOM-HEADER-X': 'Trump Cards :)' },
        }).subscribe((_) => null);
        expect(window.fetch).toHaveBeenCalled();
    });

    it('should handle POST errors', (done) => {
        expect.assertions(1);
        (window.fetch as any).mockImplementation(async () => ({
            status: 400,
            text: async () => 'Bad Request',
        }));
        Http.post('_', '').subscribe(
            (_) => null,
            (err) => {
                expect(err.status).toBe(400);
                done();
            }
        );
        jest.runOnlyPendingTimers();
    });

    it('should allow PUT requests', (done) => {
        expect.assertions(2);
        Http.put('test_url', 'test_body').subscribe((data) => {
            expect(data).toEqual({ message: 'MSG Received!!!' });
            done();
        });
        expect(window.fetch).toHaveBeenCalled();
        jest.runOnlyPendingTimers();
        (Http as any).put('', '', undefined, () => of());
    });

    it('should handle PUT errors', (done) => {
        expect.assertions(1);
        (window.fetch as any).mockImplementation(async () => ({
            status: 400,
            text: async () => 'Bad Request',
        }));
        Http.put('_', '').subscribe(
            (_) => null,
            (err) => {
                expect(err.status).toBe(400);
                done();
            }
        );
        jest.runOnlyPendingTimers();
    });

    it('should allow PATCH requests', (done) => {
        expect.assertions(2);
        Http.patch('test_url', 'test_body').subscribe((data: any) => {
            expect(data).toEqual({ message: 'MSG Received!!!' });
            done();
        });
        expect(window.fetch).toHaveBeenCalled();
        jest.runOnlyPendingTimers();
        (Http as any).patch('', '', undefined, () => of());
    });

    it('should handle PATCH errors', (done) => {
        expect.assertions(1);
        (window.fetch as any).mockImplementation(async () => ({
            status: 400,
            text: async () => 'Bad Request',
        }));
        Http.patch('_', '').subscribe(
            (_: any) => null,
            (err: HttpError) => {
                expect(err.status).toBe(400);
                done();
            }
        );
        jest.runOnlyPendingTimers();
    });

    it('should allow DELETE requests', (done) => {
        expect.assertions(2);
        Http.del('test_url').subscribe((data: any) => {
            expect(data).toBeUndefined();
            done();
        });
        expect(window.fetch).toHaveBeenCalled();
        (Http as any).del('', undefined, () => of());
    });

    it('should allow returning json data on DELETE', (done) => {
        expect.assertions(2);
        Http.del('test_url', {
            response_type: 'json',
        }).subscribe((data) => {
            expect(data).toEqual({ message: 'MSG Received!!!' });
            expect(window.fetch).toHaveBeenCalled();
            done();
        });
    });

    it('should allow returning text data on DELETE', (done) => {
        expect.assertions(2);
        Http.del('test_url', {
            response_type: 'text',
        }).subscribe((data) => {
            expect(data).toEqual('MSG Received!!!');
            expect(window.fetch).toHaveBeenCalled();
            done();
        });
    });

    it('should handle DELETE errors', (done) => {
        expect.assertions(1);
        (window.fetch as any).mockImplementation(async () => ({
            status: 400,
            text: async () => 'Bad Request',
        }));
        Http.del('_').subscribe(
            (_: any) => null,
            (err: HttpError) => {
                expect(err.status).toBe(400);
                done();
            }
        );
        jest.runOnlyPendingTimers();
    });
});
