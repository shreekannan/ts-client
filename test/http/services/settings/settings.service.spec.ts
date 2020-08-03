import { PlaceSettings } from '../../../../src/http/services/settings/settings.class';

import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/settings/settings.service';

describe('Settings API', () => {

    it('should allow querying settings', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.querySettings();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceSettings);
    });

    it('should allow showing settings details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showSettings('1');
        expect(item).toBeInstanceOf(PlaceSettings);
    });

    it('should allow creating new settings', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addSettings({});
        expect(item).toBeInstanceOf(PlaceSettings);
    });

    it('should allow updating settings details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateSettings('1', {});
        expect(item).toBeInstanceOf(PlaceSettings);
    });

    it('should allow removing settings', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeSettings('1', {});
        expect(item).toBeFalsy();
    });

    it('should allow getting settings history', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(async () => []);
        const item = await SERVICE.settingsHistory('1', {});
        expect(item).toEqual([]);
    });
});
