import { HashMap } from '../../utilities/types.utilities';
import { MockEngineWebsocketSystem } from './mock-engine-system.class';

export class PlaceSystemsMock {

    /**  */
    public static get systems() {
        return { ...this._mock_systems };
    }

    /** Register a mock system for websocket bindings */
    public static register(id: string, details: HashMap) {
        this._mock_systems[id] = new MockEngineWebsocketSystem(details);
    }

    /** Remove a mock system for websocket bindings */
    public static deregister(id: string) {
        delete this._mock_systems[id];
    }
    /** List of registered mock systems for websocket bindings */
    private static _mock_systems: HashMap<MockEngineWebsocketSystem> = {};

    /* istanbul ignore next */
    constructor() {
        throw new Error(`PlaceMockHttp is a static class`);
    }
}
