import { of } from 'rxjs';
import * as Resources from '../../src/resources/functions';
import * as SERVICE from '../../src/saml-sources/functions';
import { PlaceSAMLSource } from '../../src/saml-sources/saml-source';

describe('SAML Auth Sources API', () => {
    it('should allow querying ldapsources', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        let list = await SERVICE.querySAMLSources().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceSAMLSource);
        list = await SERVICE.querySAMLSources({}).toPromise();
    });

    it('should allow showing SAML source details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.showSAMLSource('1').toPromise();
        expect(item).toBeInstanceOf(PlaceSAMLSource);
        item = await SERVICE.showSAMLSource('1', {}).toPromise();
    });

    it('should allow creating new SAML sources', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.addSAMLSource({}).toPromise();
        expect(item).toBeInstanceOf(PlaceSAMLSource);
        item = await SERVICE.addSAMLSource({}).toPromise();
    });

    it('should allow updating SAML source details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.updateSAMLSource('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceSAMLSource);
        item = await SERVICE.updateSAMLSource('1', {}, 'patch').toPromise();
    });

    it('should allow removing SAML sources', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeSAMLSource('1').toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeSAMLSource('1', {}).toPromise();
    });
});
