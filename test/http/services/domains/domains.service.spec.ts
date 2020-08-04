
import { of } from 'rxjs';
import { PlaceDomain } from '../../../../src/http/services/domains/domain.class';

import * as SERVICE from '../../../../src/http/services/domains/domains.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Domains API', () => {

    it('should allow querying domain', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.queryDomains().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceDomain);
    });

    it('should allow showing domain details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.showDomain('1').toPromise();
        expect(item).toBeInstanceOf(PlaceDomain);
    });

    it('should allow creating new domains', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.addDomain({}).toPromise();
        expect(item).toBeInstanceOf(PlaceDomain);
    });

    it('should allow updating domain details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        const item = await SERVICE.updateDomain('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceDomain);
    });

    it('should allow removing domains', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        const item = await SERVICE.removeDomain('1', {}).toPromise();
        expect(item).toBeFalsy();
    });
});
