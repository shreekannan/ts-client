import { addSeconds } from 'date-fns';
import { isBefore } from 'date-fns';

import { BehaviorSubject, Observable } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';

import { destroyWaitingAsync, timeout, clearAsyncTimeout } from '../utilities/async';
import { generateNonce, getFragments, log, removeFragment } from '../utilities/general';
import { HashMap } from '../utilities/types';
import { MOCK_AUTHORITY, PlaceAuthOptions, PlaceAuthority, PlaceTokenResponse, AuthorizeDetails } from './interfaces';

import * as sha256 from 'fast-sha256';
import * as base64 from 'byte-base64';

/**
 * @private
 */
let _options: PlaceAuthOptions = {} as any;
/**
 * @private
 * Browser key store to use for authentication credentials. Defaults to localStorage
 */
let _storage: Storage = localStorage;
/**
 * @private
 * Authentication authority of for the current domain
 */
let _authority: PlaceAuthority | undefined;
/**
 * @private
 * Map of promises
 */
const _promises: HashMap<Promise<any> | undefined> = {};
/**
 * @private
 * OAuth 2 client ID for the application
 */
let _client_id: string = '';
/**
 * @private
 * OAuth 2 token generation code
 */
let _code: string = '';
/**
 * @private
 * In memory store for access token
 */
let _access_token: string = '';
/**
 * @private
 * In memory store for expiry time of access token
 */
let _refresh_token: string = '';
/**
 * @private
 * Current API route
 */
let _route: string = `/api/engine/v2`;
/**
 * @private
 * Whether engine is online
 */
const _online = new BehaviorSubject(false);
/**
 * @private
 * Observer for the online state of engine
 */
const _online_observer = _online.asObservable();

/** API Endpoint for the retrieved version of engine */
export function apiEndpoint(): string {
    const secure = _options.secure || location.protocol.indexOf('https') >= 0;
    const api_host = `${secure ? 'https:' : 'http:'}//${_options.host || location.host}`;
    return `${api_host}${httpRoute()}`;
}

/** Path of the API endpoint */
export function httpRoute() {
    return _route;
}

/**
 * @hidden
 */
export function needsTokenHeader(): boolean {
    return !!_options.token_header
}

/** OAuth 2 client ID for the application */
export function clientId(): string {
    return _client_id;
}

/** Redirect URI for the OAuth flow */
export function redirectUri(): string {
    return _options.redirect_uri;
}

/** Bearer token for authenticating requests to engine */
export function token(): string {
    if (_options.mock) {
        return 'mock-token';
    }
    const expires_at = `${_storage.getItem(`${_client_id}_expires_at`)}`;
    if (isBefore(new Date(+expires_at), new Date())) {
        log('Auth', 'Token expired. Requesting new token...');
        invalidateToken();
    }
    return _access_token || _storage.getItem(`${_client_id}_access_token`) || '';
}

/** Refresh token for renewing the access token */
export function refreshToken(): string {
    return _refresh_token || _storage.getItem(`${_client_id}_refresh_token`) || '';
}

/** Host domain of the PlaceOS server */
export function host(): string {
    return _options.host || location.host;
}

/** Whether the application has an authentication token */
export function hasToken(): boolean {
    return !!token();
}

/** Place Authority details */
export function authority(): PlaceAuthority | undefined {
    return _authority;
}

/** Whether engine is online */
export function isOnline(): boolean {
    return _online.getValue();
}

/** Whether engine is online */
export function isMock(): boolean {
    return !!_options.mock;
}

/** Whether engine connection is secure */
export function isSecure(): boolean {
    return !!_options.secure;
}

/** Observable for the online state of engine */
export function onlineState(): Observable<boolean> {
    return _online_observer;
}

/** Whether this application is trusted */
export function isTrusted(): boolean {
    const fragments = getFragments();
    let is_trusted = fragments.trust === 'true';
    /* istanbul ignore else */
    if (localStorage) {
        const key = `${clientId()}_trusted`;
        is_trusted =
            is_trusted ||
            localStorage.getItem(key) === 'true' ||
            localStorage.getItem('trusted') === 'true';
        localStorage.setItem(key, `${is_trusted}`);
    }
    return is_trusted;
}

/** Whether this application is on a fixed location device */
export function isFixedDevice(): boolean {
    const fragments = getFragments();
    let fixed_device = fragments.fixed_device === 'true';
    /* istanbul ignore else */
    if (localStorage) {
        const key = `${clientId()}_fixed_device`;
        fixed_device =
            fixed_device ||
            localStorage.getItem(key) === 'true' ||
            localStorage.getItem('fixed_device') === 'true';
        localStorage.setItem(key, `${fixed_device}`);
    }
    return fixed_device;
}

/** Initialise authentication for the http and realtime APIs */
export function setup(options: PlaceAuthOptions) {
    _options = options || _options;
    // Intialise storage
    _storage = _options.storage === 'session' ? sessionStorage : localStorage;
    _client_id = Md5.hashStr(_options.redirect_uri, false) as string;
    return loadAuthority();
}

/**
 * @private
 */
export function cleanupAuth() {
    _options = {} as any;
    _authority = undefined;
    _access_token = '';
    _refresh_token = '';
    _online.next(false);
    _client_id = '';
    _code = '';
    _route = `/api/engine/v2`;
    // Clear local subscriptions
    for (const key in _promises) {
        /* istanbul ignore else */
        if (_promises.hasOwnProperty(key)) {
            delete _promises[key];
        }
    }
    destroyWaitingAsync();
}

/**
 * Refresh authentication
 */
export function refreshAuthority(): Promise<void> {
    _authority = undefined;
    return loadAuthority();
}

/**
 * Invalidate the current access token
 */
export function invalidateToken(): void {
    _storage.removeItem(`${_client_id}_access_token`);
    _storage.removeItem(`${_client_id}_expires_at`);
    _access_token = '';
}

/* istanbul ignore else */
/**
 * Check the users authentication credentials and perform actions
 * required for the user to authenticate
 * @param state Additional state information for auth requests
 */
export function authorise(state?: string): Promise<string>;
export function authorise(
    state?: string,
    api_authority: PlaceAuthority = _authority as any
): Promise<string> {
    /* istanbul ignore else */
    if (!_promises.authorise) {
        _promises.authorise = new Promise<string>((resolve, reject) => {
            if (!api_authority) {
                return reject('Authority is not loaded');
            }
            log('Auth', 'Authorising user...');
            const check_token = () => {
                if (token()) {
                    log('Auth', 'Valid token found.');
                    delete _promises.authorise;
                    resolve(token());
                } else {
                    const token_handlers = [
                        (_: any) => {
                            delete _promises.authorise;
                            resolve(token());
                        },
                        (_: any) => {
                            delete _promises.authorise;
                            reject(_);
                        },
                    ];
                    if (_options && _options.auth_type === 'password') {
                        generateTokenWithCredentials(_options).then(...token_handlers);
                    } else if (_code || refreshToken()) {
                        generateToken().then(...token_handlers);
                    } else {
                        if (api_authority!.session) {
                            log('Auth', 'Users has session. Authorising application...');
                            sendToAuthorize(state).then(...token_handlers);
                        } else {
                            log('Auth', 'No user session');
                            sendToLogin(api_authority);
                            reject();
                        }
                    }
                }
            };
            checkToken().then(check_token, check_token);
        });
    }
    return _promises.authorise as Promise<string>;
}

/**
 * Logout and clear user credentials for the application
 */
export function logout(): void {
    const done = () => {
        // Remove user credentials
        for (let i = 0; i < _storage.length; i++) {
            const key = _storage.key(i);
            if (key && key.indexOf(_client_id) >= 0) {
                _storage.removeItem(key);
            }
        }
        // Redirect user to logout URL
        const url = _authority ? _authority.logout_url : '/logout';
        setTimeout(() => window.location.assign(url), 300);
        _online.next(false);
    };
    revokeToken().then(done, done);
}

/**
 * @private
 * Load authority details from engine
 */
export function loadAuthority(tries: number = 0): Promise<void> {
    if (!_promises.load_authority) {
        _promises.load_authority = new Promise<void>((resolve) => {
            _online.next(false);
            if (_options.mock) {
                // Setup mock authority
                _authority = MOCK_AUTHORITY;
                log('Auth', `System in mock mode`);
                _online.next(true);
                resolve();
                return;
            }
            log('Auth', `Fixed: ${isFixedDevice()} | Trusted: ${isTrusted()}`);
            log('Auth', `Loading authority...`);
            const secure = _options.secure || location.protocol.indexOf('https') >= 0;
            fetch(`${secure ? 'https:' : 'http:'}//${host()}/auth/authority`)
                .then((resp) => resp.json())
                .then((api_authority: PlaceAuthority) => {
                    _authority = api_authority;
                    _route = !/[2-9]\.[0-9]+\.[0-9]+/g.test(_authority.version || '') ? `/control/api` : `/api/engine/v2`;
                    const response = () => {
                        _online.next(true);
                        setTimeout(() => delete _promises.load_authority, 500);
                        resolve();
                    };
                    authorise('').then(response, response);
                })
                .catch((err) => {
                    log('Auth', `Failed to load authority(${err})`);
                    _online.next(false);
                    delete _promises.load_authority;
                    // Retry if authority fails to load
                    setTimeout(
                        () => loadAuthority(tries).then((_) => resolve()),
                        300 * Math.min(20, ++tries)
                    );
                });
        });
    }
    return _promises.load_authority;
}

/**
 * @private
 * @param state
 */
export async function sendToAuthorize(state?: string) {
    const auth_url = createLoginURL(state);
    if (_options.use_iframe) {
        return authorizeWithIFrame(auth_url);
    }
    location.assign(auth_url);
}

/* istanbul ignore next */
/**
 * @private
 * @param url Authorization URL
 */
export function authorizeWithIFrame(url: string) {
    if (!_promises.iframe_auth) {
        _promises.iframe_auth = new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.height = '1px';
            iframe.style.width = '1px';
            iframe.style.zIndex = '-1';
            iframe.id = 'place-authorize';
            iframe.src = `${url}`;
            const callback = (event: MessageEvent) => {
                if (event.origin === location.origin && event.data.type === 'place-os') {
                    const data: AuthorizeDetails = event.data;
                    document.body.removeChild(iframe);
                    clearAsyncTimeout('iframe_auth');
                    window.removeEventListener('message', callback);
                    delete _promises.iframe_auth;
                    if (data.token) {
                        resolve();
                        return _storeTokenDetails({ access_token: data.token, ...data }  as any);
                    }
                    _code = data.code || '';
                    generateToken().then(_ => resolve(_), _ => reject(_));
                }
            };
            timeout('iframe_auth', () => reject(), 15 * 1000);
            window.addEventListener('message', callback);
            iframe.onerror = _ => {
                delete _promises.iframe_auth;
                reject()
            };
            document.body.appendChild(iframe);
        });
    }
    return _promises.iframe_auth;
}

/**
 * @private
 * @param api_authority
 */
export function sendToLogin(api_authority: PlaceAuthority) {
    /* istanbul ignore else */
    if (_options.handle_login !== false) {
        log('Auth', 'Redirecting to login page...');
        // Redirect to login form
        const url = api_authority!.login_url?.replace('{{url}}', encodeURIComponent(location.href));
        setTimeout(() => window.location.assign(url), 300);
    }
    delete _promises.authorise;
}

/**
 * @private
 * Check authentication token
 */
export function checkToken(): Promise<boolean> {
    /* istanbul ignore else */
    if (!_promises.check_token) {
        _promises.check_token = new Promise((resolve, reject) => {
            if (token()) {
                log('Auth', 'Valid token found.');
                resolve(token());
            } else {
                log('Auth', 'No token. Checking URL for auth credentials...');
                checkForAuthParameters().then(
                    (_) => resolve(_),
                    (_) => reject(_)
                );
            }
            _promises.check_token = undefined;
        });
    }
    return _promises.check_token as Promise<boolean>;
}

/**
 * @private
 * Check URL for auth parameters
 */
export function checkForAuthParameters(): Promise<boolean> {
    /* istanbul ignore else */
    if (!_promises.check_params) {
        _promises.check_params = new Promise((resolve, reject) => {
            let fragments = getFragments();
            if ((!fragments || Object.keys(fragments).length <= 0) && sessionStorage) {
                fragments = JSON.parse(sessionStorage.getItem('ENGINE.auth.params') || '{}');
            }
            if (
                fragments &&
                (fragments.code || fragments.access_token || fragments.refresh_token)
            ) {
                // Store authorisation code
                if (fragments.code) {
                    _code = fragments.code;
                    removeFragment('code');
                }
                // Store refresh token
                if (fragments.refresh_token) {
                    _storage.setItem(`${_client_id}_refresh_token`, fragments.refresh_token);
                    removeFragment('refresh_token');
                }
                const saved_nonce = _storage.getItem(`${_client_id}_nonce`) || '';
                const state_parts = (fragments.state || '').split(';');
                removeFragment('state');
                removeFragment('token_type');
                const nonce = state_parts[0];
                /* istanbul ignore else */
                if (saved_nonce === nonce) {
                    _storeTokenDetails(fragments as any);
                    resolve(!!fragments.access_token);
                } else {
                    reject();
                }
            } else {
                reject();
            }
            delete _promises.check_params;
        });
    }
    return _promises.check_params as Promise<boolean>;
}

/**
 * @private
 * Generate login URL for the user to authenticate
 * @param state State information to send to the server
 */
export function createLoginURL(state?: string): string {
    const nonce = createAndSaveNonce();
    state = state ? `${nonce};${state}` : nonce;
    const has_query = _options ? (_options.auth_uri || '').indexOf('?') >= 0 : false;
    const login_url = (_options ? _options.auth_uri : null) || '/auth/oauth/authorize';
    const response_type = isTrusted() || _options.auth_type === 'auth_code' ? 'code' : 'token';
    let url =
        `${login_url}${has_query ? '&' : '?'}` +
        `response_type=${encodeURIComponent(response_type)}` +
        `&client_id=${encodeURIComponent(_client_id)}` +
        `&state=${encodeURIComponent(state)}` +
        `&redirect_uri=${encodeURIComponent(_options.redirect_uri)}` +
        `&scope=${encodeURIComponent(_options.scope)}`;
    if (response_type === 'code') {
        const { challenge, verify } = generateChallenge();
        sessionStorage.setItem(`${_client_id}_challenge`, challenge);
        url += `&code_challenge_method=S256`;
        url += `&code_challenge=${verify}`;
    }
    return url;
}

/**
 * @private
 */
const AVAILABLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
/**
 * @private
 * @param length Length of the challenge string
 */
export function generateChallenge(length: number = 43) {
    const challenge = new Array(length)
        .fill(0)
        .map(() => AVAILABLE_CHARS[Math.floor(Math.random() * AVAILABLE_CHARS.length)])
        .join('');
    var uint8array = base64.base64ToBytes(base64.base64encode(challenge));
    var verify = base64
        .bytesToBase64(sha256.hash(uint8array))
        .split('=')[0]
        .replace(/\//g, '_')
        .replace(/\+/g, '-');
    return { challenge, verify };
}

/**
 * @private
 * Generate token generation URL
 */
export function createRefreshURL(): string {
    const refresh_uri = _options.token_uri || '/auth/token';
    let url = refresh_uri + `?client_id=${encodeURIComponent(_client_id)}`;
    url += `&redirect_uri=${encodeURIComponent(_options.redirect_uri)}`;
    if (refreshToken()) {
        url += `&refresh_token=${encodeURIComponent(refreshToken())}`;
        url += `&grant_type=refresh_token`;
    } else {
        url += `&code=${encodeURIComponent(_code)}`;
        url += `&grant_type=authorization_code`;
        const challenge = sessionStorage.getItem(`${_client_id}_challenge`);
        if (challenge) {
            url += `&code_verifier=${challenge}`;
            sessionStorage.removeItem(`${_client_id}_challenge`);
        }
        _code = '';
    }
    return url;
}

/**
 * @private
 * Geneate a token URL for basic auth with the given credentials
 * @param options Credentials to add to the token
 */
export function createCredentialsURL(options: PlaceAuthOptions) {
    const refresh_uri = options.token_uri || '/auth/token';
    let url = refresh_uri + `?client_id=${encodeURIComponent(_client_id)}`;
    url += `&client_secret=${encodeURIComponent(options.client_secret || '')}`;
    url += `&grant_type=password`;
    url += `&redirect_uri=${encodeURIComponent(options.redirect_uri)}`;
    url += `&authority=${encodeURIComponent(_authority ? _authority.id : '')}`;
    url += `&username=${encodeURIComponent(options.username || '')}`;
    url += `&password=${encodeURIComponent(options.password || '')}`;
    url += `&scope=${encodeURIComponent(options.scope || '')}`;
    return url;
}

/**
 * @private
 * Revoke the current access token
 */
export function revokeToken(): Promise<void> {
    /* istanbul ignore else */
    if (!_promises.revoke_token) {
        _promises.revoke_token = new Promise<void>((resolve, reject) => {
            const token_uri = _options.token_uri || '/auth/token';
            fetch(`${token_uri}?token=${token()}`, { method: 'POST' })
                .then((_) => {
                    _access_token = '';
                    _refresh_token = '';
                    _storage.removeItem(`${_client_id}_access_token`);
                    _storage.removeItem(`${_client_id}_refresh_token`);
                    resolve();
                    delete _promises.revoke_token;
                })
                .catch((err) => {
                    reject(err);
                    delete _promises.revoke_token;
                });
        });
    }
    return _promises.revoke_token;
}

/**
 * @private
 * Generate new tokens from a auth code or refresh token
 */
export function generateToken() {
    return generateTokenWithUrl(createRefreshURL());
}

/**
 * @private
 * Generate new tokens from a username and password
 */
export function generateTokenWithCredentials(options: PlaceAuthOptions) {
    return generateTokenWithUrl(createCredentialsURL(options));
}

/**
 * @private
 * Make a request to the tokens endpoint with the given URL
 */
export function generateTokenWithUrl(url: string): Promise<void> {
    /* istanbul ignore else */
    if (!_promises.generate_tokens) {
        _promises.generate_tokens = new Promise<void>((resolve, reject) => {
            log('Auth', 'Generating new token...');
            fetch(url, { method: 'POST' })
                .then((r) => {
                    if (r.ok) return r.json()
                    throw r;
                })
                .then((tokens: PlaceTokenResponse) => {
                    _storeTokenDetails(tokens);
                    resolve();
                    delete _promises.generate_tokens;
                })
                .catch((err) => {
                    log('Auth', 'Error generating new tokens.', err);
                    _storage.removeItem(`${_client_id}_refresh_token`);
                    _refresh_token = '';
                    reject();
                    delete _promises.generate_tokens;
                });
        });
    }
    return _promises.generate_tokens as Promise<void>;
}

/* istanbul ignore next */
/**
 * @private
 * @param details
 */
export function _storeTokenDetails(details: PlaceTokenResponse) {
    const expires_at = addSeconds(new Date(), parseInt(details.expires_in, 10));
    if (isTrusted()) {
        // Store access token
        if (details.access_token) {
            _storage.setItem(`${_client_id}_access_token`, details.access_token);
            removeFragment('access_token');
        }
        // Store refresh token
        if (details.refresh_token) {
            _storage.setItem(`${_client_id}_refresh_token`, details.refresh_token);
            removeFragment('refresh_token');
        }
    }
    // Store token expiry time
    if (details.expires_in) {
        _storage.setItem(`${_client_id}_expires_at`, `${expires_at.valueOf()}`);
        removeFragment('expires_in');
    }
    _online.next(true);
    _access_token = details.access_token || '';
    _refresh_token = details.refresh_token || '';
}

/**
 * @private
 * Create nonce and save it to the set key store
 */
export function createAndSaveNonce(): string {
    const nonce = generateNonce();
    _storage.setItem(`${_client_id}_nonce`, nonce);
    return nonce;
}
