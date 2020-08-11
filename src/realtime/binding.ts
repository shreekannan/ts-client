import { HashMap } from '../utilities/types';
import { PlaceModuleBinding } from './module';
import { PlaceSystemBinding } from './system';

/** Mapping of system IDs to binding interfaces */
const _system_list: HashMap<PlaceSystemBinding> = {};

/**
 * Get binding interface for an engine system
 * @param system_id ID of the system
 */
export function getSystem(system_id: string): PlaceSystemBinding {
    if (!_system_list[system_id]) {
        _system_list[system_id] = new PlaceSystemBinding(system_id);
    }
    return _system_list[system_id];
}

/**
 * Get binding interface for an engine module
 * @param system_id ID of the system
 * @param module_id ID of the module withing the system
 * @param index Index of the module within the system
 */
export function getModule(
    system_id: string,
    module_id: string,
    index: number = 1
): PlaceModuleBinding {
    const system = getSystem(system_id);
    return system.module(module_id, index);
}
