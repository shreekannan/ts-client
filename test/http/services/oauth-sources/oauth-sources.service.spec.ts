import { PlaceOAuthSource } from '../../../../src/http/services/oauth-sources/oauth-source.class';

import * as SERVICE from '../../../../src/http/services/oauth-sources/oauth-sources.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('OAuthSources API', () => {

    it('should allow querying oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryOAuthSources();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceOAuthSource);
    });

    it('should allow showing oauth source details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showOAuthSource('1');
        expect(item).toBeInstanceOf(PlaceOAuthSource);
    });

    it('should allow creating new oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addOAuthSource({});
        expect(item).toBeInstanceOf(PlaceOAuthSource);
    });

    it('should allow updating oauth source details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateOAuthSource('1', {});
        expect(item).toBeInstanceOf(PlaceOAuthSource);
    });

    it('should allow removing oauth sources', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeOAuthSource('1', {});
        expect(item).toBeFalsy();
    });
});
