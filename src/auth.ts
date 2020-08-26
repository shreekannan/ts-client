/* istanbul ignore file */

export {
    apiEndpoint,
    httpRoute,
    cleanupAuth,
    clientId,
    redirectUri,
    token,
    refreshToken,
    host,
    hasToken,
    authority,
    isOnline,
    isMock,
    isSecure,
    onlineState,
    isTrusted,
    isFixedDevice,
    setup,
    refreshAuthority,
    invalidateToken,
    authorise,
    logout,
    listenForToken
} from './auth/functions';
export { PlaceAuthority, PlaceAuthOptions, PlaceTokenResponse } from './auth/interfaces';
