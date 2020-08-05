
import { of } from 'rxjs';
import { PlaceModule } from '../../../../src/http/services/modules/module.class';

import * as SERVICE from '../../../../src/http/services/modules/modules.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';
import { PlaceSettings } from '../../../../src/http/services/settings/settings.class';

describe('Modules API', () => {

    it('should allow querying modules', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        let list = await SERVICE.queryModules().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceModule);
        list = await SERVICE.queryModules({}).toPromise();
    });

    it('should allow showing module details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        let item = await SERVICE.showModule('1').toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
        item = await SERVICE.showModule('1', {}).toPromise();
    });

    it('should allow creating new modules', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        let item = await SERVICE.addModule({}).toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
        item = await SERVICE.addModule({}, {}).toPromise();
    });

    it('should allow updating module details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        let item = await SERVICE.updateModule('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
        item = await SERVICE.updateModule('1', {}, {}, 'patch').toPromise();
    });

    it('should allow removing modules', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        let item = await SERVICE.removeModule('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeModule('1').toPromise();
    });

    it('should allow starting a module', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of());
        const item = await SERVICE.startModule('1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow stopping a module', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of());
        const item = await SERVICE.stopModule('1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow pinging a module', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of({ host: '', pingable: false }));
        const item = await SERVICE.pingModule('1').toPromise();
        expect(item).toBeTruthy();
    });

    it('should allow getting state of a module', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of({}));
        const item = await SERVICE.moduleState('1').toPromise();
        expect(item).toBeTruthy();
    });

    it('should allow lookup of module state', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of({}));
        const item = await SERVICE.lookupModuleState('1', 'connected').toPromise();
        expect(item).toBeTruthy();
    });

    it('should allow loading module', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of({}));
        const item = await SERVICE.loadModule('1').toPromise();
        expect(item).toBeTruthy();
    });

    it('should allow settings for a module', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process([{}]) as any));
        const item = await SERVICE.moduleSettings('1').toPromise();
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceSettings);
    });
});
