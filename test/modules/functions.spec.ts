import { of } from 'rxjs';
import * as SERVICE from '../../src/modules/functions';
import { PlaceModule } from '../../src/modules/module';
import * as Resources from '../../src/resources/functions';
import { PlaceSettings } from '../../src/settings/settings';

describe('Modules API', () => {
    it('should allow querying modules', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        let list = await SERVICE.queryModules().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceModule);
        list = await SERVICE.queryModules({}).toPromise();
    });

    it('should allow showing module details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.showModule('1').toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
        item = await SERVICE.showModule('1', {}).toPromise();
    });

    it('should allow creating new modules', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.addModule({}).toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
        item = await SERVICE.addModule({}).toPromise();
    });

    it('should allow updating module details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.updateModule('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
        item = await SERVICE.updateModule('1', {}, 'patch').toPromise();
    });

    it('should allow removing modules', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
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
        spy.mockImplementation((_: any) => of(_.callback([{}]) as any));
        const item = await SERVICE.moduleSettings('1').toPromise();
        expect(item).toBeTruthy();
        expect(item[0]).toBeInstanceOf(PlaceSettings);
    });
});
