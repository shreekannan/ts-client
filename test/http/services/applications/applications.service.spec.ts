import { PlaceApplication } from '../../../../src/http/services/applications/application.class';

import * as SERVICE from '../../../../src/http/services/applications/applications.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Applications API', () => {

    it('should allow querying applications', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryApplications();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceApplication);
    });

    it('should allow showing application details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showApplication('1');
        expect(item).toBeInstanceOf(PlaceApplication);
    });

    it('should allow creating new applications', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addApplication({});
        expect(item).toBeInstanceOf(PlaceApplication);
    });

    it('should allow updating application details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateApplication('1', {});
        expect(item).toBeInstanceOf(PlaceApplication);
    });

    it('should allow removing applications', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeApplication('1', {});
        expect(item).toBeFalsy();
    });
});
