import { HashMap } from '../../utilities/types.utilities';
import { MockPlaceWebsocketSystem } from './mock-engine-system.class';

/** List of registered mock systems for websocket bindings */
const _mock_systems: HashMap<MockPlaceWebsocketSystem> = {};

/** Register a mock system for websocket bindings */
export function registerSystem(id: string, details: HashMap<HashMap[]>): void {
    _mock_systems[id] = new MockPlaceWebsocketSystem(details);
}

/** Remove a mock system for websocket bindings */
export function mockSystem(id: string): MockPlaceWebsocketSystem {
    return _mock_systems[id];
}

/** Remove a mock system for websocket bindings */
export function deregisterSystem(id: string): void {
    delete _mock_systems[id];
}
