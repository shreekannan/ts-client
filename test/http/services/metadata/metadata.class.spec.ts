
import { PlaceMetadata } from '../../../../src/http/services/metadata/metadata.class';
import { PlaceOS } from '../../../../src/placeos';

describe('PlaceMetadata', () => {
    let metadata: PlaceMetadata;
    let service: any;

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            listMetadata: jest.fn(),
            listChildMetadata: jest.fn()
        };
        jest.spyOn(PlaceOS, 'settings', 'get').mockReturnValue(null as any);
        jest.spyOn(PlaceOS, 'triggers', 'get').mockReturnValue(null as any);
        metadata = new PlaceMetadata({
            parent_id: 'dep-test',
            name: 'catering',
            description: 'In a galaxy far far away...',
            details: []
        });
        (PlaceOS as any)._initialised.next(true);
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
