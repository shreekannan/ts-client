import { HashMap } from '../utilities/types';
import { MockPlaceWebsocketModule } from './mock-module';

export class MockPlaceWebsocketSystem {
    [name: string]: any;

    constructor(properties: HashMap) {
        for (const key in properties) {
            /* istanbul ignore else */
            if (properties.hasOwnProperty(key) && properties[key]) {
                /* istanbul ignore else */
                if (properties[key] instanceof Array) {
                    properties[key].forEach((i: HashMap) => {
                        this.addModule(key, i);
                    });
                }
            }
        }
    }

    /**
     * Add new module to the system
     * @param mod_name Module class
     * @param properties Properties of the new module
     */
    private addModule(mod_name: string, properties: HashMap) {
        if (!this[mod_name]) {
            this[mod_name] = [];
        }
        this[mod_name].push(new MockPlaceWebsocketModule(this, properties));
    }
}
