
import { of } from 'rxjs';
import { PlaceSAMLSource } from '../../../../src/http/services/saml-sources/saml-source.class';

import * as Resources from '../../../../src/http/services/resources/resources.service';
import * as SERVICE from '../../../../src/http/services/saml-sources/saml-sources.service';

describe('SAML Auth Sources API', () => {

    it('should allow querying ldapsources', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.querySAMLSources().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceSAMLSource);
    });

    it('should allow showing SAML source details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.showSAMLSource('1').toPromise();
        expect(item).toBeInstanceOf(PlaceSAMLSource);
    });

    it('should allow creating new SAML sources', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.addSAMLSource({}).toPromise();
        expect(item).toBeInstanceOf(PlaceSAMLSource);
    });

    it('should allow updating SAML source details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        const item = await SERVICE.updateSAMLSource('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceSAMLSource);
    });

    it('should allow removing SAML sources', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        const item = await SERVICE.removeSAMLSource('1', {}).toPromise();
        expect(item).toBeFalsy();
    });
});
