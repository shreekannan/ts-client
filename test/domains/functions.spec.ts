import { of } from 'rxjs';
import { PlaceDomain } from '../../src/domains/domain';
import * as SERVICE from '../../src/domains/functions';
import * as Resources from '../../src/resources/functions';


describe('Domains API', () => {
    it('should allow querying domain', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        let list = await SERVICE.queryDomains().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceDomain);
        list = await SERVICE.queryDomains({}).toPromise();
    });

    it('should allow showing domain details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.showDomain('1').toPromise();
        expect(item).toBeInstanceOf(PlaceDomain);
        item = await SERVICE.showDomain('1', {}).toPromise();
    });

    it('should allow creating new domains', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.addDomain({}).toPromise();
        expect(item).toBeInstanceOf(PlaceDomain);
        item = await SERVICE.addDomain({}).toPromise();
    });

    it('should allow updating domain details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.updateDomain('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceDomain);
        item = await SERVICE.updateDomain('1', {}, 'patch').toPromise();
    });

    it('should allow removing domains', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeDomain('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeDomain('1').toPromise();
    });
});
