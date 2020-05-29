import { of, throwError } from 'rxjs';

import { EngineSettings } from '../../../../src/http/services/settings/settings.class';
import { EngineSettingsService } from '../../../../src/http/services/settings/settings.service';

describe('EngineSettingsService', () => {
    let service: EngineSettingsService;
    let http: any;

    async function testRequest(
        method: 'get' | 'post' | 'patch' | 'put' | 'delete',
        fn: any,
        result: any,
        test1: any[],
        test2: any[]
    ) {
        const item = result.hasOwnProperty('results') ? result.results : result;
        http[method]
            .mockReturnValueOnce(of(result))
            .mockReturnValueOnce(of(result));
        const value = await (service as any)[fn](...test1);
        jest.runOnlyPendingTimers();
        if (method === 'delete') {
            expect(value).toBeFalsy();
        } else {
            expect(value).toBeInstanceOf(Array);
        }
        // Test request with parameters
        await (service as any)[fn](...test2);
        jest.runOnlyPendingTimers();
    }

    beforeEach(() => {
        http = {
            responseHeaders: jest.fn(() => ({})),
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            api_endpoint: '/api/engine/v2'
        };
        service = new EngineSettingsService(http);
    });

    it('should create instance', () => {
        expect(service).toBeTruthy();
        expect(service).toBeInstanceOf(EngineSettingsService);
    });

    it('allow querying settings index', async () => {
        http.get.mockReturnValueOnce(of({ results: [{ id: 'test' }], total: 10 }));
        const result = await service.query();
        expect(http.get).toBeCalledWith('/api/engine/v2/settings');
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(EngineSettings);
    });

    it('allow querying settings show', async () => {
        http.get.mockReturnValueOnce(of({ id: 'test' }));
        const result = await service.show('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/settings/test');
        expect(result).toBeInstanceOf(EngineSettings);
    });

    it('should allow querying the history endpoint', async () => {
        jest.useFakeTimers();
        const item = { id: 'test', name: 'Test' };
        await testRequest('get', 'history', [item], ['test'], ['test', { cache: 100, test: true }]);
        expect(http.get).toBeCalledWith('/api/engine/v2/settings/test/history');
        jest.useRealTimers();
    });

    it('should save history request totals', async () => {
        jest.useFakeTimers();
        const item = { id: 'test', name: 'Test' };
        http.responseHeaders.mockReturnValue({ 'x-total-count': 10 });
        await testRequest('get', 'history', { total: 10, results: [item] }, ['test', { offset: 10 }], [{ offset: 10 }]);
        http.responseHeaders.mockReturnValue({ 'x-total-count': 25 });
        await testRequest('get', 'history', { total: 25, results: undefined }, ['test', { test: true }], [{ test: true }]);
        expect(service.total).toBe(25);
        expect(service.last_total).toBe(25);
        jest.useRealTimers();
    });
});
