import { EngineCluster } from '../../../../src/http/services/clusters/cluster.class';

describe('EngineCluster', () => {
    let application: EngineCluster;
    let service: any;

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        };
        // EngineCluster.service = service;
        application = new EngineCluster({
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
            core_memory: 3028124
        });
    });

    it('should create instance', () => {
        expect(application).toBeTruthy();
        expect(application).toBeInstanceOf(EngineCluster);
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
