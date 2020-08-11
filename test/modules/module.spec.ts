import { PlaceDriverRole } from '../../src/drivers/enums';
import { PlaceModule } from '../../src/modules/module';

describe('PlaceModule', () => {
    let module: PlaceModule;

    beforeEach(() => {
        module = new PlaceModule({
            id: 'mod_test',
            driver_id: 'dep-001',
            control_system_id: 'sys-001',
            ip: '1.1.1.1',
            tls: false,
            udp: false,
            port: 32000,
            makebreak: false,
            uri: 'test.com',
            custom_name: 'mi-name',
            settings: { settings_string: "{ star: 'death' }" },
            role: PlaceDriverRole.Device,
            notes: 'Clone wars',
            ignore_connected: false,
            control_system: { id: 'sys-001', name: 'A System' },
            driver: { id: 'dep-001', name: 'A Driver' },
        });
    });

    it('should create instance', () => {
        expect(module).toBeTruthy();
        expect(module).toBeInstanceOf(PlaceModule);
        expect(new PlaceModule()).toBeInstanceOf(PlaceModule);
    });

    it('should expose properties', () => {
        expect(module.driver_id).toBe('dep-001');
        expect(module.control_system_id).toBe('sys-001');
        expect(module.system_id).toBe('sys-001');
        expect(module.ip).toBe('1.1.1.1');
        expect(module.tls).toBe(false);
        expect(module.udp).toBe(false);
        expect(module.port).toBe(32000);
        expect(module.makebreak).toBe(false);
        expect(module.uri).toBe('test.com');
        expect(module.custom_name).toBe('mi-name');
        expect(module.settings).toBeInstanceOf(Object);
        expect(module.role).toBe(PlaceDriverRole.Device);
        expect(module.notes).toEqual('Clone wars');
        expect(module.ignore_connected).toBe(false);
    });

    it('should remove system id for non-logic modules', () => {
        module = new PlaceModule({
            control_system_id: 'sys-test',
            role: PlaceDriverRole.Logic,
        });
        expect(module.toJSON().control_system_id).toBe('sys-test');
        module = new PlaceModule({
            control_system_id: 'sys-test',
            role: PlaceDriverRole.Websocket,
        });
        expect(module.toJSON().control_system_id).toBeFalsy();
        module = new PlaceModule({
            control_system_id: 'sys-test',
            role: PlaceDriverRole.Service,
        });
        expect(module.toJSON().control_system_id).toBeFalsy();
        module = new PlaceModule({
            control_system_id: 'sys-test',
            role: PlaceDriverRole.Device,
        });
        expect(module.toJSON().control_system_id).toBeFalsy();
        module = new PlaceModule({
            control_system_id: 'sys-test',
            role: PlaceDriverRole.SSH,
            settings: '1',
        });
        expect(module.toJSON().control_system_id).toBeFalsy();
        expect(module.toJSON(true).control_system_id).toBe('sys-test');
    });
});
