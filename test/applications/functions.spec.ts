import { of } from 'rxjs';
import { PlaceApplication } from '../../src/applications/application';

import * as SERVICE from '../../src/applications/functions';
import * as Resources from '../../src/resources/functions';

describe('Applications API', () => {
    it('should allow querying applications', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of([process({})]));
        let list = await SERVICE.queryApplications().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceApplication);
        list = await SERVICE.queryApplications({}).toPromise();
    });

    it('should allow showing application details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        let item = await SERVICE.showApplication('1').toPromise();
        expect(item).toBeInstanceOf(PlaceApplication);
        item = await SERVICE.showApplication('1', {}).toPromise();
    });

    it('should allow creating new applications', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        let item = await SERVICE.addApplication({}).toPromise();
        expect(item).toBeInstanceOf(PlaceApplication);
        item = await SERVICE.addApplication({}, {}).toPromise();
    });

    it('should allow updating application details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) =>
            of(process({}) as any)
        );
        let item = await SERVICE.updateApplication('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceApplication);
        item = await SERVICE.updateApplication(
            '1',
            {},
            {},
            'patch'
        ).toPromise();
    });

    it('should allow removing applications', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeApplication('1', {}).toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeApplication('1').toPromise();
    });
});
