import { PlaceRepository } from '../../../../src/http/services/repositories/repository.class';

import * as SERVICE from '../../../../src/http/services/repositories/repositories.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Repositorys API', () => {
    it('should allow querying repositorys', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryRepositories();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceRepository);
    });

    it('should allow showing repository details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showRepository('1');
        expect(item).toBeInstanceOf(PlaceRepository);
    });

    it('should allow creating new repositorys', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addRepository({});
        expect(item).toBeInstanceOf(PlaceRepository);
    });

    it('should allow updating repository details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateRepository('1', {});
        expect(item).toBeInstanceOf(PlaceRepository);
    });

    it('should allow removing repositories', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeRepository('1', {});
        expect(item).toBeFalsy();
    });

    it('should allow listing interface repositories', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async () => ({}));
        const item = await SERVICE.listInterfaceRepositories();
        expect(item).toEqual({});
    });

    it('should allow listing repository drivers', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(async () => ['/driver']);
        const item = await SERVICE.listRepositoryDrivers('1');
        expect(item).toEqual(['/driver']);
    });

    it('should allow listing repository commits', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(async () => [{}]);
        const item = await SERVICE.listRepositoryCommits('1');
        expect(item).toEqual([{}]);
    });

    it('should allow listing repository branches', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(async () => ['master']);
        const item = await SERVICE.listRepositoryBranches('1');
        expect(item).toEqual(['master']);
    });

    it('should allow getting repository driver details', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(async () => ['/driver']);
        const item = await SERVICE.listRepositoryDriverDetails('1', {
            driver: '/driver',
            commit: '1'
        });
        expect(item).toEqual(['/driver']);
    });

    it('should allow pulling latest changes to repository', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(async () => ({}));
        const item = await SERVICE.pullRepositoryChanges('1');
        expect(item).toEqual({});
    });
});
