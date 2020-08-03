import { BehaviorSubject, Observable } from 'rxjs';

import { HashMap } from '../../utilities/types.utilities';
import { MockPlaceWebsocketSystem } from './mock-engine-system.class';

export class MockPlaceWebsocketModule {
    [name: string]: any;

    constructor(private _system: MockPlaceWebsocketSystem, properties: HashMap) {
        for (const key in properties) {
            /* istanbul ignore else */
            if (properties.hasOwnProperty(key) && properties[key] !== undefined) {
                if (properties[key] instanceof Function) {
                    this.addMethod(key, properties[key]);
                } else {
                    this.addProperty(key, properties[key]);
                }
            }
        }
    }

    /**
     * Call method on the module
     * @param command Name of the method to call on the module
     * @param args Array of arguments to pass to the method being called
     */
    public call<T = any>(command: string, args?: any[]): T | null {
        if (!args) {
            args = [];
        }
        if (this[`$${command}`] instanceof Function) {
            return this[`$${command}`](...args) as T;
        }
        return null;
    }

    /**
     * Subscribe to value changes on the given property
     * @param prop_name Name of the property
     * @param next Callback for changes to the property
     */
    public listen<T = any>(prop_name: string): Observable<T> {
        if (
            !this[`_${prop_name}`] &&
            !(this[`_${prop_name}_obs`] instanceof Observable) &&
            !this[prop_name]
        ) {
            this.addProperty<T>(prop_name, null);
        }
        const observer = this[`_${prop_name}_obs`] as Observable<T>;
        return observer;
    }

    /**
     * Add method to module
     * @param prop_name Name of the method
     * @param fn Method logic
     */
    private addMethod(prop_name: string, fn: (...args: any[]) => any) {
        if (prop_name[0] !== '$') {
            prop_name = `$${prop_name}`;
        }
        this[prop_name] = fn;
    }

    /**
     * Add observable property to module
     * @param prop_name Name of the property
     * @param value Initial value of the property
     */
    private addProperty<T = any>(prop_name: string, value: any) {
        if (prop_name[0] === '$') {
            prop_name = prop_name.replace('$', '');
        }
        this[`_${prop_name}`] = new BehaviorSubject<T>(value);
        this[`_${prop_name}_obs`] = this[`_${prop_name}`].asObservable();
        Object.defineProperty(this, prop_name, {
            get: () => this[`_${prop_name}`].getValue(),
            set: v => this[`_${prop_name}`].next(v)
        });
    }
}
