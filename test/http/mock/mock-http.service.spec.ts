import { MockHttpRequestHandlerOptions } from '../../../src/http/mock/mock-http.interfaces';

import * as Auth from '../../../src/auth/auth.service';
import * as MockHttp from '../../../src/http/mock/mock-http.service';

describe('MockHttp', () => {
    const global_handlers: MockHttpRequestHandlerOptions[] = [
        {
            path: 'test/path',
            method: 'GET',
            metadata: {},
            callback: r => 'test'
        },
        {
            path: '/test/path2',
            method: 'GET',
            metadata: {},
            callback: r => 'test'
        }
    ];

    beforeEach(() => {
        for (const handler of global_handlers) {
            MockHttp.registerMockEndpoint(handler);
        }
        jest.useFakeTimers();
    });

    afterEach(() => {
        MockHttp.clearMockEndpoints();
        jest.useRealTimers();
    });

    it('should register global handlers', () => {
        let handler = MockHttp.findRequestHandler('GET', 'test/path');
        expect(handler).toBeTruthy();
        handler = MockHttp.findRequestHandler('GET', '/test/path');
        expect(handler).toBeTruthy();
        handler = MockHttp.findRequestHandler('GET', 'test/path2');
        expect(handler).toBeTruthy();
        handler = MockHttp.findRequestHandler('GET', '/test/path2');
        expect(handler).toBeTruthy();
    });

    it('should register new handlers', () => {
        MockHttp.registerMockEndpoint({ path: 'please/delete/me', method: 'DELETE' });
        let handler = MockHttp.findRequestHandler('DELETE', 'please/delete/me');
        expect(handler).toBeTruthy();
        // Check registration of handlers with route parameters
        MockHttp.registerMockEndpoint({ path: 'please/:get/me', method: 'GET' });
        handler = MockHttp.findRequestHandler('GET', 'please/join/me');
        expect(handler).toBeTruthy();
    });

    it('should handle route parameters', done => {
        expect.assertions(3);
        MockHttp.registerMockEndpoint({ path: 'please/:get/me', method: 'GET' });
        const handler = MockHttp.findRequestHandler('GET', 'please/join/me');
        expect(handler).toBeTruthy();
        expect((handler || ({} as any)).path_structure).toEqual(['', 'get', '']);
        MockHttp.registerMockEndpoint({
            path: 'please/:get/me',
            metadata: null,
            method: 'GET',
            callback: request => {
                expect(request.route_params).toEqual({ get: 'help' });
                done();
            }
        });
        MockHttp.mockRequest('GET', 'please/help/me?query=true')!.subscribe(_ => null);
        jest.runOnlyPendingTimers();
    });

    it('should handle query parameters', done => {
        expect.assertions(1);
        MockHttp.registerMockEndpoint({
            path: 'please/:get/me',
            method: 'GET',
            callback: request => {
                expect(request.query_params).toEqual({ query: 'true' });
                done();
            }
        });
        MockHttp.mockRequest('GET', 'please/help/me?query=true')!.subscribe(_ => null);
        jest.runOnlyPendingTimers();
    });
});
