import { of } from 'rxjs';
import { PlaceRepository } from '../../src/repositories/repository';

import * as SERVICE from '../../src/repositories/functions';
import * as Resources from '../../src/resources/functions';

describe('Repositories API', () => {
    it('should allow querying repositories', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        let list = await SERVICE.queryRepositories().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceRepository);
        list = await SERVICE.queryRepositories({}).toPromise();
    });

    it('should allow showing repository details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        let item = await SERVICE.showRepository('1').toPromise();
        expect(item).toBeInstanceOf(PlaceRepository);
        item = await SERVICE.showRepository('1', {}).toPromise();
    });

    it('should allow creating new repositories', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        let item = await SERVICE.addRepository({}).toPromise();
        expect(item).toBeInstanceOf(PlaceRepository);
        item = await SERVICE.addRepository({}, {}).toPromise();
    });

    it('should allow updating repository details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) =>
            of(process({}) as any)
        );
        let item = await SERVICE.updateRepository('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceRepository);
        item = await SERVICE.updateRepository('1', {}, {}, 'patch').toPromise();
    });

    it('should allow removing repositories', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeRepository('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeRepository('1').toPromise();
    });

    it('should allow listing interface repositories', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(() => of({}));
        let item = await SERVICE.listInterfaceRepositories().toPromise();
        expect(item).toEqual({});
        item = await SERVICE.listInterfaceRepositories({}).toPromise();
    });

    it('should allow listing repository drivers', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of(['/driver']));
        let item = await SERVICE.listRepositoryDrivers('1').toPromise();
        expect(item).toEqual(['/driver']);
        item = await SERVICE.listRepositoryDrivers('1', {}).toPromise();
    });

    it('should allow listing repository commits', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of([{}]));
        const item = await SERVICE.listRepositoryCommits('1').toPromise();
        expect(item).toEqual([{}]);
    });

    it('should allow listing repository branches', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of(['master']));
        const item = await SERVICE.listRepositoryBranches('1').toPromise();
        expect(item).toEqual(['master']);
    });

    it('should allow getting repository driver details', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of(['/driver']));
        const item = await SERVICE.listRepositoryDriverDetails('1', {
            driver: '/driver',
            commit: '1',
        }).toPromise();
        expect(item).toEqual(['/driver']);
    });

    it('should allow pulling latest changes to repository', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of({}));
        const item = await SERVICE.pullRepositoryChanges('1').toPromise();
        expect(item).toEqual({});
    });
});
