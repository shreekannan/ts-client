import { PlaceSettings } from '../../../../src/http/services/settings/settings.class';
import { PlaceSystem } from '../../../../src/http/services/systems/system.class';
import { PlaceTrigger } from '../../../../src/http/services/triggers/trigger.class';
import { PlaceZone } from '../../../../src/http/services/zones/zone.class';

jest.mock('../../../../src/http/services/resources/resources.service');

import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/systems/systems.service';

describe('Systems API', () => {
    it('should allow querying systems', async () => {
        (Resources.query as any) = jest
            .fn()
            .mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.querySystems();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceSystem);
    });

    it('should allow showing system details', async () => {
        (Resources.show as any) = jest
            .fn()
            .mockImplementation(async (_, _1, process: any, _2) => process({}));
        const item = await SERVICE.showSystem('1');
        expect(item).toBeInstanceOf(PlaceSystem);
    });

    it('should allow creating new systems', async () => {
        (Resources.create as any) = jest
            .fn()
            .mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addSystem({});
        expect(item).toBeInstanceOf(PlaceSystem);
    });

    it('should allow updating system details', async () => {
        (Resources.update as any) = jest
            .fn()
            .mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}));
        const item = await SERVICE.updateSystem('1', {});
        expect(item).toBeInstanceOf(PlaceSystem);
    });

    it('should allow removing systems', async () => {
        (Resources.remove as any) = jest.fn().mockImplementation(async () => undefined);
        const item = await SERVICE.removeSystem('1', {});
        expect(item).toBeFalsy();
    });

    it('should allow adding a module to a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => undefined);
        const item = await SERVICE.addSystemModule('1', 'mod-1');
        expect(item).toBeFalsy();
    });

    it('should allow removing a module from a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => undefined);
        const item = await SERVICE.removeSystemModule('1', 'mod-1');
        expect(item).toBeFalsy();
    });

    it('should allow starting a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => undefined);
        const item = await SERVICE.startSystem('1');
        expect(item).toBeFalsy();
    });

    it('should allow stopping a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => undefined);
        const item = await SERVICE.stopSystem('1');
        expect(item).toBeFalsy();
    });

    it('should allow excuting a method on a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => ({}));
        const item = await SERVICE.executeOnSystem('1', 'test', 'mod');
        expect(item).toEqual({});
    });

    it('should allow gettings state of a system module', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => ({}));
        const item = await SERVICE.systemModuleState('1', 'mod');
        expect(item).toEqual({});
    });

    it('should allow lookup state of a system module', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => ({}));
        const item = await SERVICE.lookupSystemModuleState('1', 'mod', 1, 'connected');
        expect(item).toEqual({});
    });

    it('should allow listing methods for system module', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => ({}));
        const item = await SERVICE.functionList('1', 'mod');
        expect(item).toEqual({});
    });

    it('should allow getting module count', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => ({}));
        const item = await SERVICE.moduleCount('1', 'mod');
        expect(item).toEqual({});
    });

    it('should allow getting types of modules in a syste', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => ({}));
        const item = await SERVICE.moduleTypes('1');
        expect(item).toEqual({});
    });

    it('should allow listing system\'s zones', async () => {
        (Resources.task as any) = jest
            .fn()
            .mockImplementation(async (_, _1, _2, _3, cb) => cb([{}]));
        const item = await SERVICE.listSystemZones('1');
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceZone);
    });

    it('should allow listing system\'s triggers', async () => {
        (Resources.task as any) = jest
            .fn()
            .mockImplementation(async (_, _1, _2, _3, cb) => cb([{}]));
        const item = await SERVICE.listSystemTriggers('1');
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow adding a trigger to a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async (_, _1, _2, _3, cb) => cb({}));
        const item = await SERVICE.addSystemTrigger('1', {});
        expect(item).toBeTruthy();
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow removing a trigger from a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(async () => undefined);
        const item = await SERVICE.removeSystemTrigger('1', 'trig-1');
        expect(item).toBeFalsy();
    });

    it('should allow listing settings for a system', async () => {
        (Resources.task as any) = jest
            .fn()
            .mockImplementation(async (_, _1, _2, _3, cb) => cb([{}]));
        const item = await SERVICE.systemSettings('1');
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceSettings);
    });
});
