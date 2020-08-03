import { PlaceCluster } from '../../../../src/http/services/clusters/cluster.class';

jest.mock('../../../../src/http/services/resources/resources.service');

import * as SERVICE from '../../../../src/http/services/clusters/clusters.service';
import { PlaceProcess } from '../../../../src/http/services/clusters/process.class';
import * as Resources from '../../../../src/http/services/resources/resources.service';

describe('Cluster API', () => {
    it('should allow querying clusters', async () => {
        (Resources as any).query = jest
            .fn()
            .mockImplementation(async (_, process: any, __) => [process({})]);
        const list = await SERVICE.queryClusters();
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceCluster);
    });

    it('should allow querying processes', async () => {
        (Resources.show as any) = jest
            .fn()
            .mockImplementation(async (_, _1, process: any, _2) => process([{}]) as any);
        const list = await SERVICE.queryProcesses('1');
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);
        expect(list[0]).toBeInstanceOf(PlaceProcess);
    });

    it('should allow terminating processes', async () => {
        (Resources.show as any) = jest
            .fn()
            .mockImplementation(async (_, _1, process: any, _2) => process({}) as any);
        const item = await SERVICE.terminateProcess('1', { driver: '2' });
    });
});
