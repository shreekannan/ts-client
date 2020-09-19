import { of } from 'rxjs';
import { PlaceDriver } from '../../src/drivers/driver';
import * as SERVICE from '../../src/drivers/functions';
import * as Resources from '../../src/resources/functions';

describe('Drivers API', () => {
    it('should allow querying drivers', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        let list = await SERVICE.queryDrivers().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceDriver);
        list = await SERVICE.queryDrivers({}).toPromise();
    });

    it('should allow showing driver details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({})));
        let item = await SERVICE.showDriver('1').toPromise();
        expect(item).toBeInstanceOf(PlaceDriver);
        item = await SERVICE.showDriver('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceDriver);
    });

    it('should allow creating new drivers', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({})));
        let item = await SERVICE.addDriver({}).toPromise();
        expect(item).toBeInstanceOf(PlaceDriver);
        item = await SERVICE.addDriver({}).toPromise();
        expect(item).toBeInstanceOf(PlaceDriver);
    });

    it('should allow updating driver details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.updateDriver('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceDriver);
        item = await SERVICE.updateDriver('1', {}, 'put').toPromise();
        expect(item).toBeInstanceOf(PlaceDriver);
    });

    it('should allow removing drivers', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeDriver('1', {}).toPromise();
        item = await SERVICE.removeDriver('1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow recompiling drivers', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of());
        const item = await SERVICE.recompileDriver('1').toPromise();
        expect(item).toBeFalsy();
    });

    it('should allow checking driver is compiled', async () => {
        const spy = jest.spyOn(Resources, 'task');
        spy.mockImplementation(() => of());
        const item = await SERVICE.isDriverCompiled('1').toPromise();
        expect(item).toBeFalsy();
    });
});
