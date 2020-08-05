
import { of } from 'rxjs';
import { PlaceOAuthSource } from '../../../../src/http/services/oauth-sources/oauth-source.class';

import * as SERVICE from '../../../../src/http/services/oauth-sources/oauth-sources.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('OAuthSources API', () => {

    it('should allow querying oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.queryOAuthSources().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceOAuthSource);
    });

    it('should allow showing oauth source details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        let item = await SERVICE.showOAuthSource('1').toPromise();
        expect(item).toBeInstanceOf(PlaceOAuthSource);
        item = await SERVICE.showOAuthSource('1', {}).toPromise();
    });

    it('should allow creating new oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        let item = await SERVICE.addOAuthSource({}).toPromise();
        expect(item).toBeInstanceOf(PlaceOAuthSource);
        item = await SERVICE.addOAuthSource({}, {}).toPromise();
    });

    it('should allow updating oauth source details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        let item = await SERVICE.updateOAuthSource('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceOAuthSource);
        item = await SERVICE.updateOAuthSource('1', {}, {}, 'patch').toPromise();
    });

    it('should allow removing oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        let item = await SERVICE.removeOAuthSource('1').toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeOAuthSource('1', {}).toPromise();
    });
});
