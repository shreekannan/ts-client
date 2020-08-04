import { PlaceMetadata } from '../../../../src/http/services/metadata/metadata.class';

import { of } from 'rxjs';
import * as SERVICE from '../../../../src/http/services/metadata/metadata.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Applications API', () => {

    it('should allow listing metadata', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process([{}]) as any));
        const item = await SERVICE.showMetadata('1').toPromise();
        expect(item[0]).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow getting metadata', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.showMetadata('1', { name: 'test' }).toPromise();
        expect(item).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow creating new metadata', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.addMetadata({}).toPromise();
        expect(item).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow updating metadata details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        const item = await SERVICE.updateMetadata('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceMetadata);
    });

    it('should allow removing metadata', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        const item = await SERVICE.removeMetadata('1', {}).toPromise();
        expect(item).toBeFalsy();
    });
});
