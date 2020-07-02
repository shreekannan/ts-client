import { of } from 'rxjs';

import { PlaceMetadata } from '../../../../src/http/services/metadata/metadata.class';
import { PlaceMetadataService } from '../../../../src/http/services/metadata/metadata.service';
import { PlaceZoneMetadata } from '../../../../src/http/services/metadata/zone-metadata.class';
import { EngineZone } from '../../../../src/http/services/zones/zone.class';

describe('PlaceMetadataService', () => {
    let service: PlaceMetadataService;
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
        service = new PlaceMetadataService(http);
    });

    it('should create instance', () => {
        expect(service).toBeTruthy();
        expect(service).toBeInstanceOf(PlaceMetadataService);
    });

    it('allow querying zones show', async () => {
        http.get.mockReturnValueOnce(of({ parent_id: 'test' }));
        const result = await service.show('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/metadata/test');
        expect(result).toBeInstanceOf(PlaceMetadata);
    });

    it('allow querying zone child metadata', async () => {
        http.get.mockReturnValueOnce(of([{ zone: { id: 'test' }, metadata: { testing: 'blah' } }]));
        const result = await service.listChildMetadata('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/metadata/test/children');
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(PlaceZoneMetadata);
        expect(result[0].zone).toBeInstanceOf(EngineZone);
        expect(result[0].keys).toEqual(['testing']);
    });
});
