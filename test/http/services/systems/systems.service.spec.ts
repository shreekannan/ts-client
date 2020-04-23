import { of } from 'rxjs';
import { EngineSystem } from '../../../../src/http/services/systems/system.class';
import { EngineSystemsService } from '../../../../src/http/services/systems/systems.service';
import { EngineTrigger } from '../../../../src/http/services/triggers/trigger.class';
import { PlaceOS } from '../../../../src/placeos';

describe('EngineSystemsService', () => {
    let service: EngineSystemsService;
    let http: any;

    beforeEach(() => {
        http = {
            responseHeaders: jest.fn(() => ({})),
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            api_endpoint: '/api/engine/v2'
        };
        service = new EngineSystemsService(http);
        (PlaceOS as any)._triggers = {};
        (PlaceOS as any)._zones = {};
    });

    it('should create instance', () => {
        expect(service).toBeTruthy();
        expect(service).toBeInstanceOf(EngineSystemsService);
    });

    it('allow querying systems index', async () => {
        http.get.mockReturnValueOnce(of({ results: [{ id: 'test' }], total: 10 }));
        const result = await service.query();
        expect(http.get).toBeCalledWith('/api/engine/v2/systems');
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(EngineSystem);
    });

    it('allow querying systems show', async () => {
        http.get.mockReturnValueOnce(of({ id: 'test' }));
        const result = await service.show('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/systems/test');
        expect(result).toBeInstanceOf(EngineSystem);
    });

    it('allow removing modules', async () => {
        http.delete.mockReturnValueOnce(of(null));
        await service.removeModule('test', 'module_1');
        expect(http.delete).toBeCalledWith('/api/engine/v2/systems/test/module/module_1');
    });

    it('allow starting a system', async () => {
        http.post.mockReturnValueOnce(of(null));
        await service.startSystem('test');
        expect(http.post).toBeCalledWith('/api/engine/v2/systems/test/start', {});
    });

    it('allow stopping a system', async () => {
        http.post.mockReturnValueOnce(of(null));
        await service.stopSystem('test');
        expect(http.post).toBeCalledWith('/api/engine/v2/systems/test/stop', {});
    });

    it('allow counting system modules', async () => {
        http.get.mockReturnValueOnce(of({ count: 0 }));
        const value = await service.count('test', 'Booking');
        expect(http.get).toBeCalledWith('/api/engine/v2/systems/test/count?module=Booking');
        expect(value).toEqual({ count: 0 });
    });

    it('allow executing methods on modules', async () => {
        http.post.mockReturnValueOnce(of('test')).mockReturnValueOnce(of('test2'));
        let resp = await service.execute('test', 'explode', 'module');
        expect(http.post).toBeCalledWith('/api/engine/v2/systems/test/module_1/explode',  []);
        expect(resp).toBe('test');
        resp = await service.execute('test', 'explode', 'module', 2, ['let', 'me', 'go']);
        expect(http.post).toBeCalledWith('/api/engine/v2/systems/test/module_2/explode', ['let', 'me', 'go']);
        expect(resp).toBe('test2');
    });

    it('allow querying module state', async () => {
        http.get
            .mockReturnValueOnce(of({ test: 'yeah' }))
            .mockReturnValueOnce(of({ test: 'yeah2' }));
        let value = await service.stateLookup('test', 'module', 1, 'look');
        expect(http.get).toBeCalledWith(
            `/api/engine/v2/systems/test/module_1/look`
        );
        expect(value).toEqual({ test: 'yeah' });
        value = await service.state('test', 'module');
        expect(http.get).toBeCalledWith(`/api/engine/v2/systems/test/module_1`);
        expect(value).toEqual({ test: 'yeah2' });
    });

    it('allow querying module methods', async () => {
        http.get
            .mockReturnValueOnce(of({ test: { arity: 1 } }))
            .mockReturnValueOnce(of({ test: { arity: 2 } }));
        let value = await service.functionList('test', 'module');
        expect(http.get).toBeCalledWith(`/api/engine/v2/systems/test/functions/module_1`);
        expect(value).toEqual({ test: { arity: 1 } });
        value = await service.functionList('test', 'module', 2);
        expect(http.get).toBeCalledWith(`/api/engine/v2/systems/test/functions/module_2`);
        expect(value).toEqual({ test: { arity: 2 } });
    });

    it('allow querying module types', async () => {
        http.get.mockReturnValueOnce(of({ test: 0 }));
        const value = await service.types('test');
        expect(http.get).toBeCalledWith(`/api/engine/v2/systems/test/count`);
        expect(value).toEqual({ test: 0 });
    });

    it('allow adding modules', async () => {
        http.put.mockReturnValueOnce(of({}));
        const value = await service.addModule('test', 'mod1');
        expect(http.put).toBeCalledWith(`/api/engine/v2/systems/test/module/mod1`, {});
        expect(value).toEqual({});
    });

    it('allow listing triggers', async () => {
        http.get.mockReturnValueOnce(of([{ id: '1' }]));
        const value = await service.listTriggers('test');
        expect(http.get).toBeCalledWith(`/api/engine/v2/systems/test/triggers`);
        expect(value.length).toBe(1);
    });

    it('allow listing zones', async () => {
        http.get.mockReturnValueOnce(of([{ id: '1' }]));
        const value = await service.listZones('test');
        expect(http.get).toBeCalledWith(`/api/engine/v2/systems/test/zones`);
        expect(value.length).toBe(1);
    });

    it('allow adding triggers', async () => {
        http.post.mockReturnValueOnce(of({}));
        const value = await service.addTrigger('test', {});
        expect(http.post).toBeCalledWith(`/api/engine/v2/systems/test/triggers`, {});
        expect(value instanceof EngineTrigger).toBeTruthy();
    });

    it('allow remove triggers', async () => {
        http.delete.mockReturnValueOnce(of(null));
        const value = await service.removeTrigger('test', 'a_trigger');
        expect(http.delete).toBeCalledWith(`/api/engine/v2/systems/test/triggers/a_trigger`);
    });

    it('allow getting settings', async () => {
        http.get.mockReturnValueOnce(of([]));
        const value = await service.settings('test');
        expect(http.get).toBeCalledWith(`/api/engine/v2/systems/test/settings`);
    });

});
