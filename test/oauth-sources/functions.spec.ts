import { of } from 'rxjs';
import * as SERVICE from '../../src/oauth-sources/functions';
import { PlaceOAuthSource } from '../../src/oauth-sources/oauth-source';
import * as Resources from '../../src/resources/functions';

describe('OAuthSources API', () => {
    it('should allow querying oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_) => of({ data: [_.fn({})] } as any));
        const list = await SERVICE.queryOAuthSources().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceOAuthSource);
    });

    it('should allow showing oauth source details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.showOAuthSource('1').toPromise();
        expect(item).toBeInstanceOf(PlaceOAuthSource);
        item = await SERVICE.showOAuthSource('1', {}).toPromise();
    });

    it('should allow creating new oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.addOAuthSource({}).toPromise();
        expect(item).toBeInstanceOf(PlaceOAuthSource);
        item = await SERVICE.addOAuthSource({}).toPromise();
    });

    it('should allow updating oauth source details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_) => of(_.fn({}) as any));
        let item = await SERVICE.updateOAuthSource('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceOAuthSource);
        item = await SERVICE.updateOAuthSource('1', {}, 'patch').toPromise();
    });

    it('should allow removing oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeOAuthSource('1').toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeOAuthSource('1', {}).toPromise();
    });
});
