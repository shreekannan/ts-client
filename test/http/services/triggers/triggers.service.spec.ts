import { PlaceSystem } from '../../../../src/http/services/systems/system.class';
import { PlaceTrigger } from '../../../../src/http/services/triggers/trigger.class';

import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/triggers/triggers.service';

describe('Triggers API', () => {

    it('should allow querying triggers', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryTriggers();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow showing trigger details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showTrigger('1');
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow creating new triggers', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addTrigger({});
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow updating trigger details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateTrigger('1', {});
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow removing triggers', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeTrigger('1', {});
        expect(item).toBeFalsy();
    });

    it('should allow listing trigger\'s systems', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process([{}]) as any);
        const item = await SERVICE.listTriggerSystems('1');
        expect(item[0]).toBeInstanceOf(PlaceSystem);
    });
});
