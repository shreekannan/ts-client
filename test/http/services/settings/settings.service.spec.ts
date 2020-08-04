
import { of } from 'rxjs';
import { PlaceSettings } from '../../../../src/http/services/settings/settings.class';

import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/settings/settings.service';

describe('Settings API', () => {

    it('should allow querying settings', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.querySettings().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceSettings);
    });

    it('should allow showing settings details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        let item = await SERVICE.showSettings('1').toPromise();
        expect(item).toBeInstanceOf(PlaceSettings);
        item = await SERVICE.showSettings('1', {}).toPromise();
    });

    it('should allow creating new settings', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        let item = await SERVICE.addSettings({}).toPromise();
        expect(item).toBeInstanceOf(PlaceSettings);
        item = await SERVICE.addSettings({}, {}).toPromise();
    });

    it('should allow updating settings details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        let item = await SERVICE.updateSettings('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceSettings);
        item = await SERVICE.updateSettings('1', {}, {}, 'patch').toPromise();
    });

    it('should allow removing settings', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        let item = await SERVICE.removeSettings('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeSettings('1').toPromise();
    });

    it('should allow getting settings history', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process([{}]) as any));
        let item = await SERVICE.settingsHistory('1', {}).toPromise();
        expect(item).toBeInstanceOf(Array);
        item = await SERVICE.settingsHistory('1').toPromise();
    });
});
