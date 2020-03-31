import { of } from 'rxjs';

import { EngineZone } from '../../../../src/http/services/zones/zone.class';
import { EngineZonesService } from '../../../../src/http/services/zones/zones.service';

describe('EngineZonesService', () => {
    let service: EngineZonesService;
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
        service = new EngineZonesService(http);
    });

    it('should create instance', () => {
        expect(service).toBeTruthy();
        expect(service).toBeInstanceOf(EngineZonesService);
    });

    it('allow querying zones index', async () => {
        http.get.mockReturnValueOnce(of({ results: [{ id: 'test' }], total: 10 }));
        const result = await service.query();
        expect(http.get).toBeCalledWith('/api/engine/v2/zones');
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(EngineZone);
    });

    it('allow querying zones show', async () => {
        http.get.mockReturnValueOnce(of({ id: 'test' }));
        const result = await service.show('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/zones/test');
        expect(result).toBeInstanceOf(EngineZone);
    });

    it('allow excuting module methods', async () => {
        http.post.mockReturnValueOnce(of());
        await service.execute('test', 'exec', 'jim');
        expect(http.post).toBeCalledWith('/api/engine/v2/zones/test/jim_1/exec', []);
    });

    it('allow querying zone metadata', async () => {
        http.get.mockReturnValueOnce(of({ id: 'test' }));
        const result = await service.listMetadata('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/zones/test/metadata');
        expect(result).toBeInstanceOf(Object);
    });

    it('allow querying zone child metadata', async () => {
        http.get.mockReturnValueOnce(of([{ zone: { id: 'test' }, metadata: { testing: 'blah' } }]));
        const result = await service.listChildMetadata('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/zones/test/children/metadata');
        expect(result.length).toBe(1);
        expect(result[0].zone).toBeInstanceOf(EngineZone);
        expect(result[0].keys).toEqual(['testing']);
    });

    it('allow adding/updating zone metadata', async () => {
        http.post.mockReturnValueOnce(of({ name: 'test' }));
        const result = await service.createMetadata('test', {
            name: 'test',
            description: 'test',
            details: {}
        });
        expect(http.post).toBeCalledWith('/api/engine/v2/zones/test/metadata', {
            name: 'test',
            description: 'test',
            details: {}
        });
        expect(result).toBeTruthy();
    });

    it('allow deleting zone metadata', async () => {
        http.delete.mockReturnValueOnce(of());
        await service.deleteMetadata('test', { name: 'catering' });
        expect(http.delete).toBeCalledWith('/api/engine/v2/zones/test/metadata?name=catering');
    });
});
