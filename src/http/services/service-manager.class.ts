import { EngineResourceService } from './resources/resources.service';

export interface ServiceProvider<T extends EngineResourceService<any>> {
    provideFor: any;
    useValue: T;
}

export class ServiceManager {
    /** Set the services used to handle data model requests */
    public static setService(type: any, service: EngineResourceService<any>): void {
        const index = ServiceManager._service_list.findIndex(provider => provider.provideFor === type);
        if (index >= 0) {
            ServiceManager._service_list.splice(index, 1, { provideFor: type, useValue: service });
        } else {
            ServiceManager._service_list.push({ provideFor: type, useValue: service });
        }
    }
    /** Get the services used to handle data model requests */
    public static serviceFor<T = any>(type: any): T {
        const provider = ServiceManager._service_list.find(item => item.provideFor === type) || { useValue: null };
        return provider.useValue;
    }
    /** Map of available services for child classes */
    private static _service_list: Array<ServiceProvider<any>> = [];

    constructor() {
        throw new Error('ServiceMananger is static class');
    }
}
