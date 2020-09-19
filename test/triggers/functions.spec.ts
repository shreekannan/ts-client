import { of } from 'rxjs';
import * as Resources from '../../src/resources/functions';
import { PlaceSystem } from '../../src/systems/system';
import * as SERVICE from '../../src/triggers/functions';
import { PlaceTrigger } from '../../src/triggers/trigger';

describe('Triggers API', () => {
    it('should allow querying triggers', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        const list = await SERVICE.queryTriggers().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow showing trigger details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        const item = await SERVICE.showTrigger('1').toPromise();
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow creating new triggers', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        const item = await SERVICE.addTrigger({}).toPromise();
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow updating trigger details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        const item = await SERVICE.updateTrigger('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow removing triggers', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        const item = await SERVICE.removeTrigger('1', {}).toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow listing trigger\'s systems', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation((_: any) => of(_.callback([{}]) as any));
        const item = await SERVICE.listTriggerSystems('1').toPromise();
        expect(item[0]).toBeInstanceOf(PlaceSystem);
    });
});
