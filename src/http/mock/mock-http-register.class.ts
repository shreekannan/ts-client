import { MockHttpRequestHandlerOptions } from './mock-http.interfaces';

export class PlaceHttpMock {

    /**  */
    public static get handlers() {
        return [ ...this._mock_handlers ];
    }

    /** Register a mock http request handler */
    public static register<T = any>(details: MockHttpRequestHandlerOptions<T>): void {
        const index = this._mock_handlers.findIndex(handler => handler.path === details.path);
        index >= 0
            ? this._mock_handlers.splice(index, 1, details)
            : this._mock_handlers.push(details);
    }

    /** Remove a mock http request handler */
    public static deregister(path: string) {
        const index = this._mock_handlers.findIndex(handler => handler.path === path);
        if (index) {
            this._mock_handlers.splice(index, 1);
        }
    }
    /** List of registered mock http request handlers */
    private static _mock_handlers: MockHttpRequestHandlerOptions[] = [];

    /* istanbul ignore next */
    constructor() {
        throw new Error(`PlaceMockHttp is a static class`);
    }
}
