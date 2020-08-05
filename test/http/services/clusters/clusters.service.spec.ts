import { PlaceCluster } from '../../../../src/http/services/clusters/cluster.class';

jest.mock('../../../../src/http/services/resources/resources.service');

import { of } from 'rxjs';
import * as SERVICE from '../../../../src/http/services/clusters/clusters.service';
import { PlaceProcess } from '../../../../src/http/services/clusters/process.class';
import * as Resources from '../../../../src/http/services/resources/resources.service';

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
            .mockImplementation((_, _1, process: any, _2) => of(process([{}]) as any));
        const list = await SERVICE.queryProcesses('1').toPromise();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceProcess);
    });

    it('should allow terminating processes', async () => {
        (Resources.remove as any) = jest
            .fn()
            .mockImplementation((_, _1, _2) => of());
        const item = await SERVICE.terminateProcess('1', { driver: '2' }).toPromise();
    });
});
