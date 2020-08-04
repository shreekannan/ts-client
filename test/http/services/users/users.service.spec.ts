
import { of } from 'rxjs';
import { PlaceUser } from '../../../../src/http/services/users/user.class';

import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/users/users.service';

describe('Users API', () => {

    it('should allow querying users', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.queryUsers().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceUser);
    });

    it('should allow showing user details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.showUser('1').toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow showing current user details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.currentUser().toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow creating new users', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.addUser({}).toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow updating user details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        const item = await SERVICE.updateUser('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow removing users', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        const item = await SERVICE.removeUser('1', {}).toPromise();
        expect(item).toBeFalsy();
    });
});
