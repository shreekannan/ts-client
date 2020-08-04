import { Md5 } from 'ts-md5';

import { PlaceAuthority } from '../../src/auth/auth.interfaces';

import { Observable } from 'rxjs';
import * as Auth from '../../src/auth/auth.service';

describe('Auth', () => {
    beforeEach(() => {
        window.fetch = jest.fn().mockImplementation(async () => ({
            json: async () =>
                ({
                    version: '1.0.0',
                    login_url: '/login?continue={{url}}',
                    session: true
                } as PlaceAuthority)
        }));
    });

    afterEach(() => {
        localStorage.clear();
        Auth.cleanupAuth();
    });

    it('should allow setting up auth', async () => {
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '1',
            scope: 'public'
        });
        expect(Auth.authority).toBeTruthy();
        const client_id = Auth.clientId();
        await Auth.setup(undefined as any);
        expect(client_id).toBe(Auth.clientId());
    });

    it('should allow setting up auth with username and password', async () => {
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public',
            auth_type: 'password'
        });
        expect(Auth.authority()).toBeTruthy();

    });

    it('should expose the API endpoint', () => {
        expect(Auth.apiEndpoint()).toBe(`${location.origin}${Auth.httpRoute()}`);
    });

    it('should expose the API route', async () => {
        jest.useFakeTimers();
        expect(Auth.httpRoute()).toBe('/api/engine/v2');
        const promise = Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public'
        });
        jest.runOnlyPendingTimers();
        await promise;
        expect(Auth.httpRoute()).toBe('/control/api');
        jest.useRealTimers();
    });

    it('should expose the options', () => {
        expect(Auth.isMock()).toBe(false);
        expect(Auth.isSecure()).toBe(false);
        expect(Auth.isOnline()).toBe(false);
        expect(Auth.authority()).toBeFalsy();
        expect(Auth.redirectUri()).toBe(undefined);
        expect(Auth.host()).toBe(location.host);
        Auth.setup({
            host: 'localhost',
            auth_uri: '/auth/authorize',
            token_uri: '/auth/token',
            redirect_uri: '/oauth-resp.html',
            scope: 'public',
            mock: true,
            secure: true
        });
        expect(Auth.clientId()).toBe(Md5.hashStr('/oauth-resp.html'));
        expect(Auth.redirectUri()).toBe('/oauth-resp.html');
        expect(Auth.host()).toBe('localhost');
        expect(Auth.apiEndpoint()).toBeTruthy();
        expect(Auth.isMock()).toBe(true);
        expect(Auth.isSecure()).toBe(true);
        expect(Auth.isOnline()).toBe(true);
        expect(Auth.hasToken()).toBe(!!Auth.token());
        expect(Auth.authority()).toBeTruthy();
        expect(Auth.onlineState()).toBeInstanceOf(Observable);
    });

    it('should expose the API token', async () => {
        expect(Auth.token()).toBeFalsy();
        const options = {
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public',
            mock: true
        };
        await Auth.setup(options);
        expect(Auth.token()).toBe('mock-token');
        window.history.pushState(
            {},
            'Test Title',
            '/not-login.html?access_token=test&expires_in=3600'
        );
        await Auth.setup({ ...options, mock: false });
        await Auth.authorise();
        expect(Auth.token()).toBe('test');
    });

    it('should clear expired tokens', async () => {
        window.history.pushState(
            {},
            'Test Title',
            '/not-login.html?access_token=test&expires_in=3600'
        );
        const options = {
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public'
        };
        await Auth.setup(options);
        expect(Auth.token()).toBe('test');
        localStorage.setItem(`${Auth.clientId()}_expires_at`, `${new Date().getTime() - 3600}`);
        expect(Auth.token()).toBe('');
    });

    it('should expose the refresh token', async () => {
        window.history.pushState({}, 'Test Title', '/not-login.html?code=test');
        const options = {
            auth_uri: '',
            token_uri: 'token',
            redirect_uri: '',
            scope: 'public'
        };
        (window.fetch as any)
            .mockImplementationOnce(async () => ({
                json: async () =>
                    ({
                        version: '1.0.0',
                        login_url: '/login?continue={{url}}',
                        session: true
                    } as PlaceAuthority)
            }))
            .mockImplementationOnce(async () => ({
                json: async () => ({
                    access_token: 'today',
                    refresh_token: 'tomorrow',
                    expires_in: 3600
                })
            }));
        await Auth.setup({ ...options, mock: false });
        expect(window.fetch).toHaveBeenCalledTimes(2);
        expect(Auth.token()).toBe('today');
        expect(Auth.refreshToken()).toBe('tomorrow');
    });

    it('should expose the authority', async () => {
        expect(Auth.authority()).toBeFalsy();
        const promise = Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public'
        });
        await promise;
        expect(Auth.authority()).toBeTruthy();
    });

    it('should allow using session storage', async () => {
        window.history.pushState(
            {},
            'Test Title',
            '/not-login.html?access_token=test&expires_in=3600'
        );
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public',
            storage: 'session'
        });
        expect(Auth.token()).toBe('test');
        expect(localStorage.getItem(`${Auth.clientId()}_access_token`)).toBeNull();
        expect(sessionStorage.getItem(`${Auth.clientId()}_access_token`)).toBe('test');
    });

    it('should handle refresh token in URL', async () => {
        window.history.pushState(
            {},
            'Test Title',
            '/not-login.html?access_token=test&refresh_token=hehe&expires_in=3600&state=;^_^'
        );
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public'
        });
        expect(Auth.token()).toBe('test');
        expect(localStorage.getItem(`${Auth.clientId()}_access_token`)).toBe('test');
        expect(localStorage.getItem(`${Auth.clientId()}_refresh_token`)).toBe('hehe');
    });

    it('should fail to authorise before authority loaded', async () => {
        expect.assertions(1);
        await Auth.authorise().catch(err => {
            expect(err).toBe('Authority is not loaded');
        });
    });

    it('should redirect to login when user has no session', async done => {
        window.fetch = jest.fn().mockImplementation(async () => ({
            json: async () =>
                ({
                    version: '1.0.0'
                } as PlaceAuthority)
        }));
        const spy = jest.spyOn(location, 'assign');
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public'
        });
        setTimeout(() => {
            expect(spy).toHaveBeenCalled();
            done();
        }, 400);
    });

    it('should handle logging out', async done => {
        window.history.pushState(
            {},
            'Test Title',
            '/not-login.html?access_token=test&expires_in=3600'
        );
        const spy = jest.spyOn(location, 'assign');
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public',
            storage: 'session'
        });
        expect(Auth.token()).toBe('test');
        Auth.logout();
        setTimeout(() => {
            expect(window.fetch).toHaveBeenCalledTimes(2);
            expect(Auth.token()).toBeFalsy();
            expect(spy).toHaveBeenCalled();
            done();
        }, 400);
    });

    it('should allow refreshing the authority', async () => {
        jest.useFakeTimers();
        expect(Auth.authority()).toBeFalsy();
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public'
        });
        expect(Auth.authority()).toBeTruthy();
        window.fetch = jest.fn().mockImplementation(async () => ({
            json: async () =>
                ({
                    version: '2.0.0',
                    login_url: '/login?continue={{url}}',
                    session: true
                } as PlaceAuthority)
        }));
        jest.runOnlyPendingTimers();
        await Auth.refreshAuthority();
        expect(Auth.authority()?.version).toBe('2.0.0');
        jest.useRealTimers();
    });

    it('should handle error when loading authority', async () => {
        window.fetch = jest
            .fn()
            .mockImplementationOnce(async () => {
                throw { status: 500, ok: false, text: async () => '' };
            })
            .mockImplementation(async () => ({
                json: async () =>
                    ({
                        version: '2.0.0'
                    } as PlaceAuthority)
            }));
        await Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            secure: true,
            scope: 'public'
        });
        expect(Auth.authority()).toBeTruthy();
    });
});
