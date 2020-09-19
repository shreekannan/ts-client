import { Observable, of, throwError } from 'rxjs';
import * as Http from '../../src/http/functions';
import * as Resource from '../../src/resources/functions';

jest.mock('../../src/http/functions');

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
        const value: any = await fn({
            fn: (_: any) => _,
            path: 'resource',
            ...test1[0],
        }).toPromise();
        jest.runOnlyPendingTimers();
        expect(value.data ? value.data : value).toEqual(item || []);
        // Test request with parameters
        await fn({ fn: (_: any) => _, path: 'resource', ...test2[0] }).toPromise();
        jest.runOnlyPendingTimers();
        // Test error handling
        try {
            await fn({ fn: (_: any) => _, path: 'resource', ...test1[0] }).toPromise();
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
            json: async () => ({
                version: '1.0.0',
                login_url: '/login?continue={{url}}',
            }),
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
        await testRequest(
            'get',
            Resource.query,
            { results: [item] },
            [{}],
            [{ query_params: { cache: 100, test: true } }]
        );
        await testRequest(
            'get',
            Resource.query,
            { total: 10, results: [item] },
            [{}],
            [{ query_params: { test: true } }]
        );
        await testRequest(
            'get',
            Resource.query,
            { total: 10, results: [] },
            [{}],
            [{ query_params: { test: true } }]
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
            [{ query_params: { offset: 10 }}],
            [{ query_params: { offset: 10 }}]
        );
        headers['x-total-count'] = '25';
        resp_header_spy.mockReturnValue(headers);
        await testRequest(
            'get',
            Resource.query,
            { total: 25, results: [item] },
            [{ query_params: { test: true }}],
            [{ query_params: { test: true }}]
        );
        expect(Resource.requestTotal('resource')).toBe(10);
        expect(Resource.lastRequestTotal('resource')).toBe(25);
    });

    it('should allow for grabbing the show endpoint for an item', async () => {
        expect.assertions(4);
        const item = { id: 'test', name: 'Test' };
        await testRequest(
            'get',
            Resource.show,
            item,
            [{ id: 'test' }],
            [{ id: 'test', query_params: { test: true } }]
        );
        expect(Http.get).toBeCalledWith('http://localhost/api/engine/v2/resource/test');
        expect(Http.get).toBeCalledWith('http://localhost/api/engine/v2/resource/test?test=true');
    });

    it('should allow adding new items', async () => {
        expect.assertions(3);
        const item = { id: 'test', name: 'Test' };
        await testRequest(
            'post',
            Resource.create,
            item,
            [{ form_data: item }],
            [{ form_data: item }]
        );
        expect(Http.post).toBeCalledWith('http://localhost/api/engine/v2/resource', item);
    });

    it('should allow running POST tasks on items', async () => {
        expect.assertions(4);
        await testRequest(
            'post',
            Resource.task,
            'success',
            [{ id: 'test', task_name: 'a_task' }],
            [{ id: 'test', task_name: 'a_task', form_data: { test: true } }]
        );
        expect(Http.post).toBeCalledWith('http://localhost/api/engine/v2/resource/test/a_task', undefined);
        expect(Http.post).toBeCalledWith('http://localhost/api/engine/v2/resource/test/a_task', {
            test: true,
        });
    });

    it('should allow updating items', async () => {
        expect.assertions(3);
        const item = { id: 'test', name: 'Test' };
        await testRequest(
            'patch',
            Resource.update,
            item,
            [{ id: 'test', form_data: item }],
            [{ id: 'test', form_data: item }]
        );
        expect(Http.patch).toBeCalledWith(
            'http://localhost/api/engine/v2/resource/test?version=0',
            item
        );
        // expect(Http.put).toBeCalledWith(
        //     'http://localhost/api/engine/v2/resource/test?version=0',
        //     item
        // );
    });

    it('should allow deleting items', async () => {
        expect.assertions(4);
        const item = { id: 'test', name: 'Test' };
        await testRequest(
            'del',
            Resource.remove,
            item,
            [{ id: 'test' }],
            [{ id: 'test', query_params: { test: true } }]
        );
        expect(Http.del).toBeCalledWith('http://localhost/api/engine/v2/resource/test');
        expect(Http.del).toBeCalledWith('http://localhost/api/engine/v2/resource/test?test=true');
    });

    it('should allow running GET tasks on items', async () => {
        expect.assertions(4);
        await testRequest(
            'get',
            Resource.task,
            'success',
            [{ id: 'test', task_name: 'a_task', method: 'get' }],
            [{ id: 'test', task_name: 'a_task', form_data: { test: true }, method: 'get' }]
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
