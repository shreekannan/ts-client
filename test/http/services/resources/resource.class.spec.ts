import { PlaceResource } from '../../../../src/http/services/resources/resource.class';

class Resource extends PlaceResource {}

describe('PlaceResource', () => {
    let resource: Resource;
    let service: any;

    beforeEach(() => {
        service = {
            add: jest.fn(),
            delete: jest.fn(),
            update: jest.fn()
        };
        service.add.mockReturnValue(Promise.resolve());
        service.delete.mockReturnValue(Promise.resolve());
        service.update.mockReturnValue(Promise.resolve());
        resource = new Resource({ id: 'test', name: 'Test', created_at: 999, updated_at: 999 });
    });

    it('should expose id', () => {
        expect(resource.id).toBe('test');
    });

    it('should expose name', () => {
        expect(resource.name).toBe('Test');
    });

    it('should expose creation time', () => {
        expect(resource.created_at).toEqual(999);
    });

    it('should expose updated time', () => {
        expect(resource.updated_at).toEqual(999);
    });
});
