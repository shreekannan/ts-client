import { PlaceUser } from '../../../../src/http/services/users/user.class';

import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/users/users.service';

describe('Users API', () => {

    it('should allow querying users', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryUsers();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceUser);
    });

    it('should allow showing user details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showUser('1');
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow showing current user details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.currentUser();
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow creating new users', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addUser({});
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow updating user details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateUser('1', {});
        expect(item).toBeInstanceOf(PlaceUser);
    });

    it('should allow removing users', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeUser('1', {});
        expect(item).toBeFalsy();
    });
});
