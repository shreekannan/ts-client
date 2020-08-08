import { PlaceCluster } from '../../src/clusters/cluster';

import { of } from 'rxjs';
import * as SERVICE from '../../src/clusters/functions';
import { PlaceProcess } from '../../src/clusters/process';
import * as Resources from '../../src/resources/functions';

jest.mock('../../src/resources/functions');

describe('Cluster API', () => {
    it('should allow querying clusters', async () => {
        (Resources.query as any) = jest
            .fn()
            .mockImplementation((_, process: any, __) => of([process({})]));
        const list = await SERVICE.queryClusters().toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceCluster);
    });

    it('should allow querying processes', async () => {
        (Resources.show as any) = jest
            .fn()
            .mockImplementation((_, _1, process: any, _2) =>
                of(process([{}]) as any)
            );
        const list = await SERVICE.queryProcesses('1').toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceProcess);
    });

    it('should allow terminating processes', async () => {
        (Resources.remove as any) = jest
            .fn()
            .mockImplementation((_, _1, _2) => of());
        await SERVICE.terminateProcess('1', '2').toPromise();
    });
});
