import { EngineDriver } from '../../../../src/http/services/drivers/driver.class';
import { EngineDriverRole } from '../../../../src/http/services/drivers/drivers.enums';
import { ServiceManager } from '../../../../src/http/services/service-manager.class';
import { PlaceOS } from '../../../../src/placeos';

describe('EngineDriver', () => {
    let driver: EngineDriver;
    let service: any;

    beforeEach(() => {
        service = {
            recompile: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        };
        jest.spyOn(PlaceOS, 'settings', 'get').mockReturnValue(null as any);
        ServiceManager.setService(EngineDriver, service);
        driver = new EngineDriver({
            id: 'dep-test',
            description: 'In a galaxy far far away...',
            module_name: 'SteamShip',
            role: EngineDriverRole.Logic,
            default_uri: 'Sometimes we default',
            default_port: 1234,
            ignore_connected: false,
            settings: { settings_string: '{ today: false, future: \'Yeah!\' }' },
            class_name: '::ACA::SolveProblem',
            created_at: 999,
            repository_id: 'my-repo',
            file_name: 'fancy-driver.cr',
            commit: 'some-hash'
        });
        (PlaceOS as any)._initialised.next(true);
    });

    it('should create instance', () => {
        expect(driver).toBeTruthy();
        expect(driver).toBeInstanceOf(EngineDriver);
    });

    it('should expose description', () => {
        expect(driver.description).toBe('In a galaxy far far away...');
    });

    it('should allow setting description', () => {
        driver.storePendingChange('description', 'another-desc');
        expect(driver.description).not.toBe('another-desc');
        expect(driver.changes.description).toBe('another-desc');
    });

    it('should expose module name', () => {
        expect(driver.module_name).toBe('SteamShip');
    });

    it('should allow setting module name', () => {
        driver.storePendingChange('module_name', 'a_mod_name');
        expect(driver.module_name).not.toBe('a_mod_name');
        expect(driver.changes.module_name).toBe('a_mod_name');
    });

    it('should expose role', () => {
        expect(driver.role).toBe(EngineDriverRole.Logic);
    });

    it('should allow setting role on new modules', () => {
        driver.storePendingChange('role', EngineDriverRole.Service);
        expect(driver.role).not.toBe(EngineDriverRole.Service);
        expect(driver.changes.role).toBe(EngineDriverRole.Service);
    });

    it('should expose default uri', () => {
        expect(driver.default_uri).toBe('Sometimes we default');
    });

    it('should allow setting default URI', () => {
        driver.storePendingChange('default_uri', 'No default today');
        expect(driver.default_uri).not.toBe('No default today');
        expect(driver.changes.default_uri).toBe('No default today');
    });

    it('should expose default port', () => {
        expect(driver.default_port).toBe(1234);
    });

    it('should allow setting default port', () => {
        driver.storePendingChange('default_port', 4200);
        expect(driver.default_port).not.toBe(4200);
        expect(driver.changes.default_port).toBe(4200);
    });

    it('should expose ignore connected', () => {
        expect(driver.ignore_connected).toBe(false);
    });

    it('should allow setting default', () => {
        driver.storePendingChange('ignore_connected', true);
        expect(driver.ignore_connected).not.toBe(true);
        expect(driver.changes.ignore_connected).toBe(true);
    });

    it('should expose settings', () => {
        expect(driver.settings).toBeInstanceOf(Object);
    });

    it('should expose repository ID', () => {
        expect(driver.repository_id).toBe('my-repo');
    });

    it('should expose file name', () => {
        expect(driver.file_name).toBe('fancy-driver.cr');
    });

    it('should expose commit hash', () => {
        expect(driver.commit).toBe('some-hash');
    });

    it('should allow recompiling the driver', async () => {
        service.recompile.mockReturnValue(Promise.resolve());
        await driver.recompile();
        expect(service.recompile).toBeCalledWith('dep-test');
        const new_driver = new EngineDriver({});
        try {
            new_driver.recompile();
            throw new Error('Failed to error');
        } catch (e) {
            expect(e).not.toEqual(new Error('Failed to error'));
        }
    });

    it('should expose class name', () => {
        expect(driver.class_name).toEqual('::ACA::SolveProblem');
    });

    it('should expose class name', () => {
        expect(driver.created_at).toEqual(999);
    });
});
