
import { humanReadableByteCount } from '../../../utilities/general.utilities';
import { HashMap } from '../../../utilities/types.utilities';

export class PlaceProcess {
    /** ID of the cluster associated with the process */
    public readonly cluster_id: string;
    /** Unique identifier of the application */
    public readonly id: string;
    /** List of module IDs that are running in this process */
    public readonly modules: readonly string[];
    /** Whether the process is running */
    public readonly running: boolean;
    /** Number if modules instances running in this process */
    public readonly module_instances: number;
    /** Last exit code of the process */
    public readonly last_exit_code: number;
    /** Number of times this process has been launched */
    public readonly launch_count: number;
    /** Time that the latest instance of the process launched */
    public readonly launch_time: number;
    /** Current CPU usage of the process */
    public readonly cpu_usage: number;
    /** Total amount of available memory on the host in KB */
    public readonly memory_total: number;
    /** Total amount of memory used by the process in KB */
    public readonly memory_usage: number;
    /** Display string for the memory usage */
    public readonly used_memory: string;
    /** Display string for the memory total */
    public readonly total_memory: string;

    constructor(_cluster_id: string, raw_data: HashMap = {}) {
        this.cluster_id = _cluster_id;
        this.id = raw_data.id || raw_data.driver || '';
        this.modules = raw_data.modules || [];
        this.running = raw_data.running || false;
        this.module_instances = raw_data.module_instances || 0;
        this.last_exit_code = raw_data.last_exit_code || 0;
        this.launch_count = raw_data.launch_count || 0;
        this.launch_time = raw_data.launch_time || 0;
        this.cpu_usage = raw_data.cpu_usage || raw_data.percentage_cpu || 0;
        this.memory_total = raw_data.memory_total || 0;
        this.memory_usage = raw_data.memory_usage || 0;
        this.used_memory = humanReadableByteCount(this.memory_usage * 1024);
        this.total_memory = humanReadableByteCount(this.memory_total * 1024);
    }
}
