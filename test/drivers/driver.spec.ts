import { PlaceDriver } from '../../src/drivers/driver';
import { PlaceDriverRole } from '../../src/drivers/enums';
import { PlaceSettings } from '../../src/settings/settings';

describe('PlaceDriver', () => {
    let driver: PlaceDriver;

    beforeEach(() => {
        driver = new PlaceDriver({
            id: 'dep-test',
            description: 'In a galaxy far far away...',
            module_name: 'SteamShip',
            role: PlaceDriverRole.Logic,
            default_uri: 'Sometimes we default',
            default_port: 1234,
            ignore_connected: false,
            settings: [
                { settings_string: "{ today: false, future: 'Yeah!' }" },
            ],
            class_name: '::ACA::SolveProblem',
            created_at: 999,
            repository_id: 'my-repo',
            file_name: 'fancy-driver.cr',
            commit: 'some-hash',
        });
    });

    it('should create instance', () => {
        expect(driver).toBeTruthy();
        expect(driver).toBeInstanceOf(PlaceDriver);
    });

    it('should expose properties', () => {
        expect(driver.description).toBe('In a galaxy far far away...');
        expect(driver.module_name).toBe('SteamShip');
        expect(driver.role).toBe(PlaceDriverRole.Logic);
        expect(driver.default_uri).toBe('Sometimes we default');
        expect(driver.default_port).toBe(1234);
        expect(driver.ignore_connected).toBe(false);
        expect(driver.settings).toBeInstanceOf(Array);
        expect(driver.repository_id).toBe('my-repo');
        expect(driver.file_name).toBe('fancy-driver.cr');
        expect(driver.commit).toBe('some-hash');
        expect(driver.class_name).toEqual('::ACA::SolveProblem');
        expect(driver.created_at).toEqual(999);
    });

    it('should handle no settings', () => {
        driver = new PlaceDriver();
        expect(driver.settings).toBeInstanceOf(Array);
        expect(driver.settings[0]).toBeInstanceOf(PlaceSettings);
    });
});
