import { Md5 } from 'ts-md5';

import { PlaceAuthority } from '../../src/auth/auth.interfaces';

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
        Auth.cleanup();
    });

    it('should allow setting up auth', () => {
        Auth.setup({
            auth_uri: '',
            token_uri: '',
            redirect_uri: '',
            scope: 'public'
        });
        expect(Auth.authority).toBeTruthy();
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
        Auth.setup({
            auth_uri: '/auth/authorize',
            token_uri: '/auth/token',
            redirect_uri: '/oauth-resp.html',
            scope: 'public'
        });
        expect(Auth.clientId()).toBe(Md5.hashStr('/oauth-resp.html'));
        expect(Auth.redirectUri()).toBe('/oauth-resp.html');
        expect(Auth.host()).toBe(location.host);
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
});
