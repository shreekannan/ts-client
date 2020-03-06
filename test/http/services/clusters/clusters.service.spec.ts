import { of } from 'rxjs';

import { EngineCluster } from '../../../../src/http/services/clusters/cluster.class';
import { EngineClustersService } from '../../../../src/http/services/clusters/clusters.service';
import { EngineProcess } from '../../../../src/http/services/clusters/process.class';

describe('EngineClustersService', () => {
    let service: EngineClustersService;
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
        service = new EngineClustersService(http);
    });

    it('should create instance', () => {
        expect(service).toBeTruthy();
        expect(service).toBeInstanceOf(EngineClustersService);
    });

    it('allow querying clusters index', async () => {
        http.get.mockReturnValueOnce(of({ results: [{ id: 'test' }], total: 10 }));
        const result = await service.query();
        expect(http.get).toBeCalledWith('/api/engine/v2/cluster');
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(EngineCluster);
    });

    it('allow querying clusters show', async () => {
        http.get.mockReturnValueOnce(of([{ driver: 'test' }]));
        const result = await service.show('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/cluster/test');
        expect(result[0]).toBeInstanceOf(EngineProcess);
    });

    it('allow querying clusters killing processes', async () => {
        http.delete.mockReturnValueOnce(of());
        const result = await service.delete('test', { driver: 'a-driver' });
        expect(http.delete).toBeCalledWith('/api/engine/v2/cluster/test?driver=a-driver');
    });
});
