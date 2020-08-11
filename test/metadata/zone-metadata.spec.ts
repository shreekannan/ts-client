import { PlaceZoneMetadata } from '../../src/metadata/zone-metadata';
import { PlaceZone } from '../../src/zones/zone';

describe('PlaceMetadata', () => {
    let metadata: PlaceZoneMetadata;

    beforeEach(() => {
        metadata = new PlaceZoneMetadata({
            zone: {},
            metadata: { test: {} },
            keys: ['test'],
        });
    });

    it('should create instance', () => {
        expect(metadata).toBeTruthy();
        expect(metadata).toBeInstanceOf(PlaceZoneMetadata);
        new PlaceZoneMetadata();
    });

    it('should expose properties', () => {
        expect(metadata.zone).toBeInstanceOf(PlaceZone);
        expect(metadata.keys).toBeInstanceOf(Array);
        expect(metadata.metadata).toBeInstanceOf(Object);
        expect(metadata.metadata.test).toBeTruthy();
    });
});
