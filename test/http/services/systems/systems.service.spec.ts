import { PlaceSettings } from '../../../../src/http/services/settings/settings.class';
import { PlaceSystem } from '../../../../src/http/services/systems/system.class';
import { PlaceTrigger } from '../../../../src/http/services/triggers/trigger.class';
import { PlaceZone } from '../../../../src/http/services/zones/zone.class';

jest.mock('../../../../src/http/services/resources/resources.service');

import { of } from 'rxjs';
import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/systems/systems.service';

describe('Systems API', () => {
    it('should allow querying systems', async () => {
        (Resources.query as any) = jest
            .fn()
            .mockImplementation((_, process: any, __) => of([process({})]));
        let list = await SERVICE.querySystems().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceSystem);
        list = await SERVICE.querySystems({}).toPromise();
    });

    it('should allow showing system details', async () => {
        (Resources.show as any) = jest
            .fn()
            .mockImplementation((_, _1, process: any, _2) => of(process({})));
        let item = await SERVICE.showSystem('1').toPromise();
        expect(item).toBeInstanceOf(PlaceSystem);
        item = await SERVICE.showSystem('1', {}).toPromise();
    });

    it('should allow creating new systems', async () => {
        (Resources.create as any) = jest
            .fn()
            .mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        let item = await SERVICE.addSystem({}).toPromise();
        expect(item).toBeInstanceOf(PlaceSystem);
        item = await SERVICE.addSystem({}, {}).toPromise();
    });

    it('should allow updating system details', async () => {
        (Resources.update as any) = jest
            .fn()
            .mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({})));
        let item = await SERVICE.updateSystem('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceSystem);
        item = await SERVICE.updateSystem('1', {}, {}, 'patch').toPromise();
    });

    it('should allow removing systems', async () => {
        (Resources.remove as any) = jest.fn().mockImplementation(() => of());
        let item = await SERVICE.removeSystem('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeSystem('1').toPromise();
    });

    it('should allow adding a module to a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of());
        let item = await SERVICE.addSystemModule('1', 'mod-1').toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.addSystemModule('1', 'mod-1', {}).toPromise();
    });

    it('should allow removing a module from a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of());
        const item = await SERVICE.removeSystemModule('1', 'mod-1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow starting a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of());
        const item = await SERVICE.startSystem('1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow stopping a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of());
        const item = await SERVICE.stopSystem('1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow excuting a method on a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of({}));
        let item = await SERVICE.executeOnSystem('1', 'test', 'mod').toPromise();
        expect(item).toEqual({});
        item = await SERVICE.executeOnSystem('1', 'test', 'mod', 2, ['Yeah']).toPromise();
    });

    it('should allow gettings state of a system module', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of({}));
        let item = await SERVICE.systemModuleState('1', 'mod').toPromise();
        expect(item).toEqual({});
        item = await SERVICE.systemModuleState('1', 'mod', 2).toPromise();
    });

    it('should allow lookup state of a system module', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of({}));
        let item = await SERVICE.lookupSystemModuleState('1', 'mod', 1, 'connected').toPromise();
        expect(item).toEqual({});
        item = await SERVICE.lookupSystemModuleState(
            '1',
            'mod',
            undefined,
            'connected'
        ).toPromise();
    });

    it('should allow listing methods for system module', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of({}));
        let item = await SERVICE.functionList('1', 'mod').toPromise();
        expect(item).toEqual({});
        item = await SERVICE.functionList('1', 'mod', 3).toPromise();
    });

    it('should allow getting module count', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of({}));
        const item = await SERVICE.moduleCount('1', 'mod').toPromise();
        expect(item).toEqual({});
    });

    it('should allow getting types of modules in a syste', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of({}));
        const item = await SERVICE.moduleTypes('1').toPromise();
        expect(item).toEqual({});
    });

    it('should allow listing system\'s zones', async () => {
        (Resources.task as any) = jest.fn().mockImplementation((_, _1, _2, _3, cb) => of(cb([{}])));
        const item = await SERVICE.listSystemZones('1').toPromise();
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceZone);
    });

    it('should allow listing system\'s triggers', async () => {
        (Resources.task as any) = jest.fn().mockImplementation((_, _1, _2, _3, cb) => of(cb([{}])));
        const item = await SERVICE.listSystemTriggers('1').toPromise();
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow adding a trigger to a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation((_, _1, _2, _3, cb) => of(cb({})));
        const item = await SERVICE.addSystemTrigger('1', {}).toPromise();
        expect(item).toBeTruthy();
        expect(item).toBeInstanceOf(PlaceTrigger);
    });

    it('should allow removing a trigger from a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation(() => of());
        const item = await SERVICE.removeSystemTrigger('1', 'trig-1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow listing settings for a system', async () => {
        (Resources.task as any) = jest.fn().mockImplementation((_, _1, _2, _3, cb) => of(cb([{}])));
        const item = await SERVICE.systemSettings('1').toPromise();
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceSettings);
    });
});
