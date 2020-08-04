import { Observable, of, throwError } from 'rxjs';

jest.mock('../../../../src/http/http.service');

import * as Http from '../../../../src/http/http.service';
import * as Resource from '../../../../src/http/services/resources/resources.service';

describe('Resource API', () => {
    let resp_header_spy: jest.SpyInstance;

    async function testRequest<T>(
        method: 'get' | 'post' | 'patch' | 'put' | 'del',
        fn: (...args: any[]) => Observable<T>,
        result: any,
        test1: any[],
        test2: any[]
    ) {
        const item = result.hasOwnProperty('results') ? result.results : result;
        (Http[method] as jest.Mock)
            .mockReturnValueOnce(of(result))
            .mockReturnValueOnce(of(result))
            .mockImplementationOnce(() => throwError('An Error Value'));
        const value = await fn(...test1).toPromise();
        jest.runOnlyPendingTimers();
        expect(value).toEqual(item || []);
        // Test request with parameters
        await fn(...test2).toPromise();
        jest.runOnlyPendingTimers();
        // Test error handling
        try {
            await fn(...test1).toPromise();
            throw new Error('Failed to error');
        } catch (e) {
            expect(e).toBe('An Error Value');
        }
        jest.runOnlyPendingTimers();
    }

    beforeEach(() => {
        jest.useFakeTimers();
        resp_header_spy = jest.spyOn(Http, 'responseHeaders');
        window.fetch = jest.fn().mockImplementation(async () => ({
            json: async () => ({ version: '1.0.0', login_url: '/login?continue={{url}}' })
        }));
    });

    afterEach(() => {
        jest.useRealTimers();
        Resource.cleanupAPI();
        const methods: any[] = ['get', 'post', 'patch', 'put', 'del'];
        for (const method of methods) {
            ((Http as any)[method] as jest.Mock).mockReset();
            ((Http as any)[method] as jest.Mock).mockRestore();
        }
    });

    it('should allow querying the index endpoint', async () => {
        expect.assertions(8);
        const item = { id: 'test', name: 'Test' };
        await testRequest('get', Resource.query, [item], [], [{ cache: 100, test: true }]);
        await testRequest(
            'get',
            Resource.query,
            { total: 10, results: [item] },
            [],
            [{ test: true }]
        );
        await testRequest(
            'get',
            Resource.query,
            { total: 10, results: undefined },
            [],
            [{ test: true }]
        );
        expect(Http.get).toBeCalledWith('http://localhost/api/engine/v2/resource');
        expect(Http.get).toBeCalledWith('http://localhost/api/engine/v2/resource?test=true');
    });

    it('should save index request totals', async () => {
        expect.assertions(6);
        const item = { id: 'test', name: 'Test' };
        const headers = { 'x-total-count': '10' };
        resp_header_spy.mockReturnValue(headers);
        await testRequest(
            'get',
            Resource.query,
            { total: 10, results: [item] },
            [{ offset: 10 }],
            [{ offset: 10 }]
        );
        headers['x-total-count'] = '25';
        resp_header_spy.mockReturnValue(headers);
        await testRequest(
            'get',
            Resource.query,
            { total: 25, results: undefined },
            [{ test: true }],
            [{ test: true }]
        );
        expect(Resource.total()).toBe(10);
        expect(Resource.last_total()).toBe(25);
    });

    it('should allow for grabbing the show endpoint for an item', async () => {
        expect.assertions(4);
        const item = { id: 'test', name: 'Test' };
        await testRequest('get', Resource.show, item, ['test'], ['test', { test: true }]);
        expect(Http.get).toBeCalledWith('http://localhost/api/engine/v2/resource/test');
        expect(Http.get).toBeCalledWith('http://localhost/api/engine/v2/resource/test?test=true');
    });

    it('should allow adding new items', async () => {
        expect.assertions(4);
        const item = { id: 'test', name: 'Test' };
        await testRequest('post', Resource.create, item, [item], [item, { test: true }]);
        expect(Http.post).toBeCalledWith('http://localhost/api/engine/v2/resource', item);
        expect(Http.post).toBeCalledWith('http://localhost/api/engine/v2/resource?test=true', item);
    });

    it('should allow running POST tasks on items', async () => {
        expect.assertions(4);
        await testRequest(
            'post',
            Resource.task,
            'success',
            ['test', 'a_task'],
            ['test', 'a_task', { test: true }]
        );
        expect(Http.post).toBeCalledWith('http://localhost/api/engine/v2/resource/test/a_task', {});
        expect(Http.post).toBeCalledWith('http://localhost/api/engine/v2/resource/test/a_task', {
            test: true
        });
    });

    it('should allow updating items', async () => {
        expect.assertions(4);
        const item = { id: 'test', name: 'Test' };
        await testRequest(
            'patch',
            Resource.update,
            item,
            ['test', item],
            ['test', item, { test: true }]
        );
        expect(Http.patch).toBeCalledWith('http://localhost/api/engine/v2/resource/test', item);
        expect(Http.patch).toBeCalledWith(
            'http://localhost/api/engine/v2/resource/test?test=true',
            item
        );
    });

    it('should allow deleting items', async () => {
        expect.assertions(4);
        const item = { id: 'test', name: 'Test' };
        await testRequest('del', Resource.remove, item, ['test'], ['test', { test: true }]);
        expect(Http.del).toBeCalledWith('http://localhost/api/engine/v2/resource/test');
        expect(Http.del).toBeCalledWith('http://localhost/api/engine/v2/resource/test?test=true');
    });

    it('should allow running GET tasks on items', async () => {
        expect.assertions(4);
        await testRequest(
            'get',
            Resource.task,
            'success',
            ['test', 'a_task', null, 'get'],
            ['test', 'a_task', { test: true }, 'get']
        );
        expect(Http.get).toBeCalledWith('http://localhost/api/engine/v2/resource/test/a_task');
        expect(Http.get).toBeCalledWith(
            'http://localhost/api/engine/v2/resource/test/a_task?test=true'
        );
    });

    it('should allow getting the next page', () => {
        expect(Resource.next()).toBeFalsy();
    });
});
