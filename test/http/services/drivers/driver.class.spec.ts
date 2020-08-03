import { PlaceDriver } from '../../../../src/http/services/drivers/driver.class';
import { PlaceDriverRole } from '../../../../src/http/services/drivers/drivers.enums';

describe('PlaceDriver', () => {
    let driver: PlaceDriver;
    let service: any;

    beforeEach(() => {
        service = {
            recompile: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        };
        driver = new PlaceDriver({
            id: 'dep-test',
            description: 'In a galaxy far far away...',
            module_name: 'SteamShip',
            role: PlaceDriverRole.Logic,
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
    });

    it('should create instance', () => {
        expect(driver).toBeTruthy();
        expect(driver).toBeInstanceOf(PlaceDriver);
    });

    it('should expose description', () => {
        expect(driver.description).toBe('In a galaxy far far away...');
    });

    it('should expose module name', () => {
        expect(driver.module_name).toBe('SteamShip');
    });

    it('should expose role', () => {
        expect(driver.role).toBe(PlaceDriverRole.Logic);
    });

    it('should expose default uri', () => {
        expect(driver.default_uri).toBe('Sometimes we default');
    });

    it('should expose default port', () => {
        expect(driver.default_port).toBe(1234);
    });

    it('should expose ignore connected', () => {
        expect(driver.ignore_connected).toBe(false);
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

    it('should expose class name', () => {
        expect(driver.class_name).toEqual('::ACA::SolveProblem');
    });

    it('should expose class name', () => {
        expect(driver.created_at).toEqual(999);
    });
});
