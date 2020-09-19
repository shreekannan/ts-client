import { of } from 'rxjs';
import * as Resources from '../../src/resources/functions';
import * as SERVICE from '../../src/users/functions';
import { PlaceUser } from '../../src/users/user';

describe('Users API', () => {
    it('should allow querying users', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        let list = await SERVICE.queryUsers().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceUser);
        list = await SERVICE.queryUsers({}).toPromise();
    });

    it('should allow showing user details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.showUser('1').toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
        item = await SERVICE.showUser('1', {}).toPromise();
    });

    it('should allow showing current user details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.currentUser().toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
        item = await SERVICE.currentUser({}).toPromise();
    });

    it('should allow creating new users', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.addUser({}).toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
        item = await SERVICE.addUser({}).toPromise();
    });

    it('should allow updating user details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.updateUser('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
        item = await SERVICE.updateUser('1', {}, 'patch').toPromise();
    });

    it('should allow removing users', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeUser('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeUser('1').toPromise();
    });
});
