import { of } from 'rxjs';
import * as Resources from '../../src/resources/functions';
import * as SERVICE from '../../src/settings/functions';
import { PlaceSettings } from '../../src/settings/settings';

describe('Settings API', () => {
    it('should allow querying settings', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        const list = await SERVICE.querySettings().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceSettings);
    });

    it('should allow showing settings details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.showSettings('1').toPromise();
        expect(item).toBeInstanceOf(PlaceSettings);
        item = await SERVICE.showSettings('1', {}).toPromise();
    });

    it('should allow creating new settings', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.addSettings({}).toPromise();
        expect(item).toBeInstanceOf(PlaceSettings);
        item = await SERVICE.addSettings({}, {}).toPromise();
    });

    it('should allow updating settings details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.updateSettings('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceSettings);
        item = await SERVICE.updateSettings('1', {}, {}, 'patch').toPromise();
    });

    it('should allow removing settings', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeSettings('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeSettings('1').toPromise();
    });

    it('should allow getting settings history', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation((_: any) => of(_.callback([{}]) as any));
        let item = await SERVICE.settingsHistory('1', {}).toPromise();
        expect(item).toBeInstanceOf(Array);
        item = await SERVICE.settingsHistory('1').toPromise();
    });
});
