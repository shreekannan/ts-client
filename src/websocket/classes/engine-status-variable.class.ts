import { Observable } from 'rxjs';

import { bind, listen, status, unbind, value } from '../websocket.class';
import { PlaceRequestOptions } from '../websocket.interfaces';
import { PlaceModuleBinding } from './engine-module.class';

export class PlaceVariableBinding<T = any> {
    /** Status variable name */
    public readonly name: string;
    /** Number of active bindings to this variable */
    private _binding_count: number = 0;
    /** Number of bindings to restore on reconnection */
    private _stale_bindings: number = 0;

    constructor(private _module: PlaceModuleBinding, _name: string) {
        this.name = _name;
        // Listen for state changes in the websocket connection
        status().subscribe(connected => {
            if (connected && this._stale_bindings) {
                this.rebind();
            } else {
                this._stale_bindings = this._binding_count || this._stale_bindings;
                this._binding_count = 0;
            }
        });
    }

    /** Number of bindings to this status variable */
    public get count(): number {
        return this._binding_count;
    }

    /** Current value of the binding */
    public get value(): T | undefined {
        return value<T>(this.binding());
    }

    /**
     * Subscribe to changes of the variable's binding value
     * @param next Callback for changes to the bindings value
     */
    public listen(): Observable<T> {
        return listen(this.binding());
    }

    /**
     * Bind to the status variable's value
     */
    public bind(): () => void {
        /* istanbul ignore else */
        if (this._binding_count <= 0) {
            bind(this.binding()).then(() => {
                this._binding_count++;
            });
        }
        return () => this.unbind();
    }

    /**
     * Unbind from status variable
     */
    public unbind() {
        if (this._binding_count === 1) {
            unbind(this.binding()).then(() => {
                this._binding_count--;
            });
        } else {
            this._binding_count--;
            if (this._binding_count < 0) {
                this._binding_count = 0;
            }
        }
    }

    /**
     * Rebind to the status variable
     */
    private rebind() {
        bind(this.binding()).then(() => {
            this._binding_count = this._stale_bindings;
            this._stale_bindings = 0;
        });
    }

    /**
     * Generate binding details for the status variable
     */
    private binding(): PlaceRequestOptions {
        return {
            sys: this._module.system.id,
            mod: this._module.name,
            index: this._module.index,
            name: this.name
        };
    }
}
