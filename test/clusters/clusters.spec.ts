import { PlaceCluster } from '../../src/clusters/cluster';

describe('PlaceCluster', () => {
    let application: PlaceCluster;

    beforeEach(() => {
        // PlaceCluster.service = service;
        application = new PlaceCluster({
            id: '01E2PRBSNE4GXM9WGVM7M3KEZX',
            compiled_drivers: ['drivers_aca_private_helper_fe33588'],
            available_repositories: ['drivers', 'aca-drivers'],
            running_drivers: 1,
            module_instances: 1,
            unavailable_repositories: [],
            unavailable_drivers: [],
            hostname: 'core',
            cpu_count: 3,
            core_cpu: 0,
            total_cpu: 0,
            memory_total: 8155620,
            memory_usage: 3028124,
            core_memory: 3028124,
        });
    });

    it('should create instance', () => {
        expect(application).toBeTruthy();
        expect(application).toBeInstanceOf(PlaceCluster);
        let app = new PlaceCluster({
            id: '01E2PRBSNE4GXM9WGVM7M3KEZX',
            load: {
                local: {
                    hostname: 'core',
                    cpu_count: 3,
                    core_cpu: 0,
                    total_cpu: 0,
                    memory_total: 8155620,
                    memory_usage: 3028124,
                    core_memory: 3028124,
                },
                edge: [{}]
            },
        } as any);
        expect(app.edge_nodes.length).toBe(1);
        app = new PlaceCluster({
            id: '01E2PRBSNE4GXM9WGVM7M3KEZX',
            run_counts: { local: { drivers: 2, modules: 1 } },
        } as any);
    });

    it('should expose ID', () => {
        expect(application.id).toBe('01E2PRBSNE4GXM9WGVM7M3KEZX');
    });

    it('should allow generating display string for memory usage', () => {
        expect(application.used_memory).toBe('2.89 GB');
    });

    it('should allow generating display string for memory total', () => {
        expect(application.total_memory).toBe('7.78 GB');
    });
});
