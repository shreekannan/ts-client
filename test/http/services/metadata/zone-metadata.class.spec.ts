import { PlaceZoneMetadata } from '../../../../src/http/services/metadata/zone-metadata.class';
import { PlaceZone } from '../../../../src/http/services/zones/zone.class';

describe('PlaceMetadata', () => {
    let metadata: PlaceZoneMetadata;
    let service: any;

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            listMetadata: jest.fn(),
            listChildMetadata: jest.fn()
        };
        metadata = new PlaceZoneMetadata({
            zone: {},
            metadata: { test: {} },
            keys: ['test']
        });
    });

    it('should create instance', () => {
        expect(metadata).toBeTruthy();
        expect(metadata).toBeInstanceOf(PlaceZoneMetadata);
        const empty = new PlaceZoneMetadata();
    });

    it('should expose properties', () => {
        expect(metadata.zone).toBeInstanceOf(PlaceZone);
        expect(metadata.keys).toBeInstanceOf(Array);
        expect(metadata.metadata).toBeInstanceOf(Object);
        expect(metadata.metadata.test).toBeTruthy();
    });
});
