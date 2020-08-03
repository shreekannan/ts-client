import { PlaceDriverRole } from '../../../../src/http/services/drivers/drivers.enums';
import { PlaceModule } from '../../../../src/http/services/modules/module.class';

describe('PlaceModule', () => {
    let module: PlaceModule;
    const features: string[] = ['test', 'device', 'here'];
    const modules: string[] = ['test', 'device', 'here'];
    const zones: string[] = ['test', 'device', 'here'];

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
            settings: { settings_string: '{ star: \'death\' }' },
            role: PlaceDriverRole.Device,
            notes: 'Clone wars',
            ignore_connected: false,
            control_system: { id: 'sys-001', name: 'A System' },
            driver: { id: 'dep-001', name: 'A Driver' }
        });
    });

    it('should create instance', () => {
        expect(module).toBeTruthy();
        expect(module).toBeInstanceOf(PlaceModule);
    });

    it('should expose driver id', () => {
        expect(module.driver_id).toBe('dep-001');
    });

    it('should expose system id', () => {
        expect(module.control_system_id).toBe('sys-001');
        expect(module.system_id).toBe('sys-001');
    });

    it('should expose ip address', () => {
        expect(module.ip).toBe('1.1.1.1');
    });

    it('should expose TLS', () => {
        expect(module.tls).toBe(false);
    });

    it('should expose UDP', () => {
        expect(module.udp).toBe(false);
    });

    it('should expose port number', () => {
        expect(module.port).toBe(32000);
    });

    it('should expose makebreak', () => {
        expect(module.makebreak).toBe(false);
    });

    it('should expose uri', () => {
        expect(module.uri).toBe('test.com');
    });

    it('should expose custom name', () => {
        expect(module.custom_name).toBe('mi-name');
    });

    it('should expose settings', () => {
        expect(module.settings).toBeInstanceOf(Object);
    });

    it('should expose role', () => {
        expect(module.role).toBe(PlaceDriverRole.Device);
    });

    it('should expose notes', () => {
        expect(module.notes).toEqual('Clone wars');
    });

    it('should expose ignore connected', () => {
        expect(module.ignore_connected).toBe(false);
    });
});
