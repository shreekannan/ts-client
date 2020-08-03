import { PlaceModule } from '../../../../src/http/services/modules/module.class';

import * as SERVICE from '../../../../src/http/services/modules/modules.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Modules API', () => {

    it('should allow querying modules', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryModules();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceModule);
    });

    it('should allow showing module details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showModule('1');
        expect(item).toBeInstanceOf(PlaceModule);
    });

    it('should allow creating new modules', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addModule({});
        expect(item).toBeInstanceOf(PlaceModule);
    });

    it('should allow updating module details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateModule('1', {});
        expect(item).toBeInstanceOf(PlaceModule);
    });

    it('should allow removing modules', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeModule('1', {});
        expect(item).toBeFalsy();
    });
});
