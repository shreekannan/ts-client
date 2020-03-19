import { of } from 'rxjs';
import { EngineModule } from '../../../../src/http/services/modules/module.class';
import { EngineModulesService } from '../../../../src/http/services/modules/modules.service';

describe('EngineModuleService', () => {
    let service: EngineModulesService;
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
        service = new EngineModulesService(http);
    });

    it('should create instance', () => {
        expect(service).toBeTruthy();
        expect(service).toBeInstanceOf(EngineModulesService);
    });

    it('allow querying modules index', async () => {
        http.get.mockReturnValueOnce(of({ results: [{ id: 'test' }], total: 10 }));
        const result = await service.query();
        expect(http.get).toBeCalledWith('/api/engine/v2/modules');
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(EngineModule);
    });

    it('allow starting a module', async () => {
        http.post.mockReturnValueOnce(of(null));
        await service.start('test');
        expect(http.post).toBeCalledWith('/api/engine/v2/modules/test/start', {});
    });

    it('allow stopping a module', async () => {
        http.post.mockReturnValueOnce(of(null));
        await service.stop('test');
        expect(http.post).toBeCalledWith('/api/engine/v2/modules/test/stop', {});
    });

    it('allow pinging a module', async () => {
        const response = { host: 'test.com', pingable: true };
        http.post.mockReturnValueOnce(of(response));
        const ping = await service.ping('test');
        expect(http.post).toBeCalledWith('/api/engine/v2/modules/test/ping', {});
        expect(ping).toBe(response);
    });

    it('allow querying module state', async () => {
        http.get
            .mockReturnValueOnce(of({ test: 'yeah' }))
            .mockReturnValueOnce(of({ test: 'yeah2' }));
        let value = await service.stateLookup('test', 'look');
        expect(http.get).toBeCalledWith(`/api/engine/v2/modules/test/state/look`);
        expect(value).toEqual({ test: 'yeah' });
        value = await service.state('test');
        expect(http.get).toBeCalledWith(`/api/engine/v2/modules/test/state`);
        expect(value).toEqual({ test: 'yeah2' });
    });

    it('allow querying the internal state of a module', async () => {
        const response = { host: 'test.com', pingable: true };
        http.get.mockReturnValueOnce(of(response));
        const ping = await service.state('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/modules/test/state');
        expect(ping).toBe(response);
    });
});
