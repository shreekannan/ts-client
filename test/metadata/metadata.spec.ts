import { PlaceMetadata } from '../../src/metadata/metadata';

describe('PlaceMetadata', () => {
    let metadata: PlaceMetadata;

    beforeEach(() => {
        metadata = new PlaceMetadata({
            parent_id: 'dep-test',
            name: 'catering',
            description: 'In a galaxy far far away...',
            details: [],
        });
    });

    it('should create instance', () => {
        expect(metadata).toBeTruthy();
        expect(metadata).toBeInstanceOf(PlaceMetadata);
    });

    it('should expose properties', () => {
        expect(metadata.id).toBe('dep-test');
        expect(metadata.name).toBe('catering');
        expect(metadata.description).toBe('In a galaxy far far away...');
        expect(metadata.details).toEqual([]);
    });
});
