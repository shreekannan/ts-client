import { PlaceLDAPSource } from '../../../../src/http/services/ldap-sources/ldap-source.class';

import * as SERVICE from '../../../../src/http/services/ldap-sources/ldap-sources.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('LDAPSources API', () => {

    it('should allow querying ldapsources', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryLDAPSources();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow showing ldapsource details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showLDAPSource('1');
        expect(item).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow creating new LDAP sources', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addLDAPSource({});
        expect(item).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow updating LDAP source details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateLDAPSource('1', {});
        expect(item).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow removing ldapsources', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeLDAPSource('1', {});
        expect(item).toBeFalsy();
    });
});
