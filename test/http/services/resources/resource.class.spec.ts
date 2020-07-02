import { EngineResource } from '../../../../src/http/services/resources/resource.class';
import { ServiceManager } from '../../../../src/http/services/service-manager.class';

class Resource extends EngineResource<any> { }

describe('EngineResource', () => {
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
        ServiceManager.setService(EngineResource, service);
        resource = new Resource({ id: 'test', name: 'Test', created_at: 999, updated_at: 999 });
    });

    it('should expose id', () => {
        expect(resource.id).toBe('test');
    });

    it('should error if changes to invalid property stored', () => {
        expect(() => resource.storePendingChange('id', true)).toThrowError();
    });

    it('should expose name', () => {
        expect(resource.name).toBe('Test');
    });

    it('should allow changing the name', () => {
        resource.storePendingChange('name', 'Another Test');
        expect(resource.name).toBe('Test');
        expect(resource.changes.name).toBe('Another Test');
    });

    it('should allow saving new resource', async () => {
        resource.storePendingChange('name', 'Another Test');
        (resource as any).id = undefined;
        await resource.save();
        expect(service.add).toBeCalledWith(resource.toJSON());
    });

    it('should allow updating existing resource', async () => {
        expect.assertions(1);
        resource.storePendingChange('name', 'Another Test');
        await resource.save();
        expect(service.update).toBeCalledWith(resource.id, resource.toJSON(), { version: 0 }, 'patch');
    });

    it('should allow deleting exisiting resource', async () => {
        await resource.delete();
        expect(service.delete).toBeCalledWith(resource.id);
    });

    it('should allow clearing pending changes', () => {
        resource.storePendingChange('name', 'Another Test');
        expect(Object.keys(resource.changes).length).toBe(1);
        resource.clearPendingChanges();
        expect(Object.keys(resource.changes).length).toBe(0);
    });

    it('should expose creation time', () => {
        expect(resource.created_at).toEqual(999);
    });

    it('should expose updated time', () => {
        expect(resource.updated_at).toEqual(999);
    });
});
