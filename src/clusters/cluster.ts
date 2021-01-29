import { HashMap } from 'src/utilities/types';
import { humanReadableByteCount } from '../utilities/general';

interface PlaceClusterRunCounts {
    modules: number;
    drivers: number;
}
interface PlaceClusterDetails {
    hostname: string;
    cpu_count: number;
    core_cpu: number;
    total_cpu: number;
    memory_total: number;
    memory_usage: number;
    core_memory: number;
    run_count?: PlaceClusterRunCounts;
}
interface PlaceClusterComplete extends PlaceCluster {
    status: HashMap;
    load: {
        local: PlaceClusterDetails;
        edge: HashMap<PlaceClusterDetails>;
    };
}
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
    /** List of edge nodes within the cluster */
    public readonly edge_nodes: PlaceClusterDetails[];

    public readonly run_counts: PlaceClusterRunCounts;

    constructor(raw_data: Partial<PlaceClusterComplete> = {}) {
        this.id = raw_data.id || '';
        this.compiled_drivers = raw_data.compiled_drivers || [];
        this.available_repositories =
            raw_data.available_repositories || raw_data.status?.available_repositories || [];
        this.running_drivers = raw_data.running_drivers || raw_data.status?.running_drivers || 0;
        this.module_instances = raw_data.module_instances || raw_data.status?.module_instances || 0;
        this.unavailable_repositories =
            raw_data.unavailable_repositories || raw_data.status?.unavailable_repositories || [];
        this.unavailable_drivers =
            raw_data.unavailable_drivers || raw_data.status?.unavailable_drivers || [];
        this.hostname = raw_data.hostname || raw_data.load?.local.hostname || '';
        this.cpu_count = raw_data.cpu_count || raw_data.load?.local.cpu_count || 0;
        this.core_cpu = raw_data.core_cpu || raw_data.load?.local.core_cpu || 0;
        this.total_cpu = raw_data.total_cpu || raw_data.load?.local.total_cpu || 0;
        this.memory_total = raw_data.memory_total || raw_data.load?.local.memory_total || 0;
        this.memory_usage = raw_data.memory_usage || raw_data.load?.local.memory_usage || 0;
        this.core_memory = raw_data.core_memory || raw_data.load?.local.core_memory || 0;
        this.run_counts = raw_data.run_counts ||
            raw_data.status?.run_counts?.local || { modules: 0, drivers: 0 };
        this.memory_percentage = +((this.memory_usage / this.memory_total) * 100).toFixed(4);
        this.used_memory = humanReadableByteCount(this.memory_usage * 1024);
        this.total_memory = humanReadableByteCount(this.memory_total * 1024);
        const edges = raw_data.load?.edge || {};
        this.edge_nodes =
            raw_data.edge_nodes ||
            Object.keys(edges).map((_) => ({
                id: _,
                ...edges[_],
                run_count: raw_data.status?.run_count?.edge[_] || {},
            })) ||
            [];
    }
}
