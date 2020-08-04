
import { of } from 'rxjs';
import { PlaceApplication } from '../../../../src/http/services/applications/application.class';

import * as SERVICE from '../../../../src/http/services/applications/applications.service';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Applications API', () => {

    it('should allow querying applications', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.queryApplications().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceApplication);
    });

    it('should allow showing application details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.showApplication('1').toPromise();
        expect(item).toBeInstanceOf(PlaceApplication);
    });

    it('should allow creating new applications', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) => of(process({}) as any));
        const item = await SERVICE.addApplication({}).toPromise();
        expect(item).toBeInstanceOf(PlaceApplication);
    });

    it('should allow updating application details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) => of(process({}) as any));
        const item = await SERVICE.updateApplication('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceApplication);
    });

    it('should allow removing applications', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation( () => of());
        const item = await SERVICE.removeApplication('1', {}).toPromise();
        expect(item).toBeFalsy();
    });
});
