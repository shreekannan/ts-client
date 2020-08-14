import { of } from 'rxjs';
import { PlaceLDAPSource } from '../../src/ldap-sources/ldap-source';

import * as SERVICE from '../../src/ldap-sources/functions';
import * as Resources from '../../src/resources/functions';

describe('LDAPSources API', () => {
    it('should allow querying ldapsources', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of({ data: [process({})] } as any));
        const list = await SERVICE.queryLDAPSources().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow showing ldapsource details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        const item = await SERVICE.showLDAPSource('1').toPromise();
        expect(item).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow creating new LDAP sources', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        const item = await SERVICE.addLDAPSource({}).toPromise();
        expect(item).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow updating LDAP source details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) =>
            of(process({}) as any)
        );
        const item = await SERVICE.updateLDAPSource('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should allow removing ldapsources', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        const item = await SERVICE.removeLDAPSource('1', {}).toPromise();
        expect(item).toBeFalsy();
    });
});
