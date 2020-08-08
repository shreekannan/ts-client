import { PlaceProcess } from '../../src/clusters/process';

describe('Cluster Process', () => {
    let process: PlaceProcess;

    beforeEach(() => {
        process = new PlaceProcess('test-cluster', {
            driver: '/app/bin/drivers/drivers_aca_private_helper_fe33588',
            modules: ['mod-ETbLjPMTRfb'],
            running: true,
            module_instances: 1,
            last_exit_code: 0,
            launch_count: 1,
            launch_time: 1583459286,
            percentage_cpu: 0,
            memory_total: 8155620,
            memory_usage: 92468,
        });
    });

    it('should create instance', () => {
        expect(process).toBeTruthy();
        expect(process).toBeInstanceOf(PlaceProcess);
    });

    it('should expose ID', () => {
        expect(process.id).toBe(
            '/app/bin/drivers/drivers_aca_private_helper_fe33588'
        );
    });

    it('should allow generating display string for memory usage', () => {
        expect(process.used_memory).toBe('90.30 MB');
    });

    it('should allow generating display string for memory total', () => {
        expect(process.total_memory).toBe('7.78 GB');
    });
});
