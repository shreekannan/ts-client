import { PlaceDomain } from '../../../../src/http/services/domains/domain.class';

import * as SERVICE from '../../../../src/http/services/domains/domains.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Domains API', () => {

    it('should allow querying domain', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryDomains();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceDomain);
    });

    it('should allow showing domain details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showDomain('1');
        expect(item).toBeInstanceOf(PlaceDomain);
    });

    it('should allow creating new domains', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addDomain({});
        expect(item).toBeInstanceOf(PlaceDomain);
    });

    it('should allow updating domain details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateDomain('1', {});
        expect(item).toBeInstanceOf(PlaceDomain);
    });

    it('should allow removing domains', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeDomain('1', {});
        expect(item).toBeFalsy();
    });
});
