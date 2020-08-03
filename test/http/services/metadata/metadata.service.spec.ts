import { PlaceMetadata } from '../../../../src/http/services/metadata/metadata.class';

import * as SERVICE from '../../../../src/http/services/metadata/metadata.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Applications API', () => {

    it('should allow listing metadata', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process([{}]) as any);
        const item = await SERVICE.showMetadata('1');
        expect(item[0]).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow getting metadata', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.showMetadata('1', { name: 'test' });
        expect(item).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow creating new metadata', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.addMetadata({});
        expect(item).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow updating metadata details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation(async (_, _0, _1, _2, process: any, _3) => process({}) as any);
        const item = await SERVICE.updateMetadata('1', {});
        expect(item).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow removing metadata', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(async () => undefined);
        const item = await SERVICE.removeMetadata('1', {});
        expect(item).toBeFalsy();
    });
});
