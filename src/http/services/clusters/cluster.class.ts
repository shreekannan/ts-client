
import { humanReadableByteCount } from '../../../utilities/general.utilities';
import { HashMap } from '../../../utilities/types.utilities';

export class PlaceCluster {
    /** Unique identifier of the application */
    public readonly id: string;
    /** List of running drivers */
    public readonly compiled_drivers: readonly string[];
    /** List of running drivers */
    public readonly available_repositories: readonly string[];
    /** Number of actively running drivers */
    public readonly running_drivers: number;
    /** Number of actively running drivers */
    public readonly module_instances: number;
    /** List of repositories that are unavailable to the cluster */
    public readonly unavailable_repositories: readonly string[];
    /** List of drivers that are unavailable to the cluster */
    public readonly unavailable_drivers: readonly string[];
    /** Name of the cluster */
    public readonly hostname: string;
    /** Number of CPUs available on the host */
    public readonly cpu_count: number;
    /** Percentage of CPU usage by the cluster's root process */
    public readonly core_cpu: number;
    /** Percentage of CPU usage by the whole cluster */
    public readonly total_cpu: number;
    /** Total amount of available memory on the host in KB */
    public readonly memory_total: number;
    /** Total amount of memory used by the whole cluster in KB */
    public readonly memory_usage: number;
    /** Total amount of memory used by the cluster root process in KB */
    public readonly core_memory: number;
    /** Percentage of memory used by the cluster */
    public readonly memory_percentage: number;
    /** Display string for the memory usage */
    public readonly used_memory: string;
    /** Display string for the memory total */
    public readonly total_memory: string;

    constructor(raw_data: HashMap = {}) {
        this.id = raw_data.id || '';
        this.compiled_drivers = raw_data.compiled_drivers || [];
        this.available_repositories = raw_data.available_repositories || [];
        this.running_drivers = raw_data.running_drivers || 0;
        this.module_instances = raw_data.module_instances || 0;
        this.unavailable_repositories = raw_data.unavailable_repositories || [];
        this.unavailable_drivers = raw_data.unavailable_drivers || [];
        this.hostname = raw_data.hostname || '';
        this.cpu_count = raw_data.cpu_count || 0;
        this.core_cpu = raw_data.core_cpu || 0;
        this.total_cpu = raw_data.total_cpu || 0;
        this.memory_total = raw_data.memory_total || 0;
        this.memory_usage = raw_data.memory_usage || 0;
        this.core_memory = raw_data.core_memory || 0;
        this.memory_percentage = +(this.memory_usage / this.memory_total * 100).toFixed(4);
        this.used_memory = humanReadableByteCount(this.memory_usage * 1024);
        this.total_memory = humanReadableByteCount(this.memory_total * 1024);

    }
}
