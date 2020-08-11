import { HttpError } from '../../src/http/interfaces';

import { of } from 'rxjs';

import * as Auth from '../../src/auth/functions';
import * as Http from '../../src/http/functions';

jest.mock('../../src/auth/functions');

describe('Http', () => {
    beforeEach(() => {
        (Auth as any).refreshAuthority = jest.fn(() => Promise.resolve());
        (Auth as any).invalidateToken = jest.fn(() => Promise.resolve());
        (Auth as any).has_token = jest.fn();
        (Auth as any).has_token.mockReturnValue(true);
        (Auth as any).has_token.mockReturnValue(true);
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

    it('should refresh auth on 401 errors on GET and DELETE requests', async () => {
        expect.assertions(4);
        window.fetch = jest.fn().mockImplementation(async () => ({
            status: 400,
            text: () => Promise.resolve('Bad Request'),
        }));
        await Http.get('_')
            .toPromise()
            .catch((_) => {
                expect(Auth.refreshAuthority).not.toBeCalled();
            });
        (Auth as any).has_token.mockReturnValue(false);
        window.fetch = jest.fn().mockImplementation(async () => ({
            status: 401,
            text: () => Promise.resolve('Unauthorised'),
        }));
        await Http.get('_')
            .toPromise()
            .catch((_) => _);
        expect(Auth.refreshAuthority).toBeCalled();
        (Auth as any).has_token.mockReturnValue(true);
        await Http.get('_')
            .toPromise()
            .catch((_) => {
                expect(Auth.invalidateToken).toHaveBeenCalledTimes(2);
                expect(Auth.refreshAuthority).toHaveBeenCalledTimes(2);
            });
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
            expect(data).toBe('MSG Received!!!');
            done();
        });
        expect(window.fetch).toHaveBeenCalled();
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
                expect(err).toEqual({
                    status: 400,
                    message: 'Bad Request',
                });
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
                expect(err).toEqual({
                    status: 400,
                    message: 'Bad Request',
                });
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
                expect(err).toEqual({
                    status: 400,
                    message: 'Bad Request',
                });
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
                expect(err).toEqual({
                    status: 400,
                    message: 'Bad Request',
                });
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
                expect(err).toEqual({
                    status: 400,
                    message: 'Bad Request',
                });
                done();
            }
        );
        jest.runOnlyPendingTimers();
    });
});
