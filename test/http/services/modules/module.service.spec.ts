
import { of } from 'rxjs';
import { PlaceModule } from '../../../../src/http/services/modules/module.class';

import * as SERVICE from '../../../../src/http/services/modules/modules.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Modules API', () => {

    it('should allow querying modules', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.queryModules().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceModule);
    });

    it('should allow showing module details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.showModule('1').toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
    });

    it('should allow creating new modules', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.addModule({}).toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
    });

    it('should allow updating module details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        const item = await SERVICE.updateModule('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceModule);
    });

    it('should allow removing modules', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        const item = await SERVICE.removeModule('1', {}).toPromise();
        expect(item).toBeFalsy();
    });
});
