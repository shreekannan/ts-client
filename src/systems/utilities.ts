import { startOfMinute, sub } from 'date-fns';

export function generateMockSystem(overrides: any = {}) {
    if (typeof overrides !== 'object' || !overrides) {
        overrides = {};
    }
    const id = `sys-${Math.floor(Math.random() * 999_999)}`;
    const created = sub(startOfMinute(new Date()), {
        minutes: Math.floor(Math.random() * 99) * 15,
    }).getTime();
    return {
        id,
        name: `System ${Math.floor(Math.random() * 999_999)}`,
        description: ``,
        email: `${id}@placeos.com`,
        capacity: Math.floor(Math.random() * 11 + 1) * 2,
        features: 'VC',
        bookable: Math.floor(Math.random() * 99999999) % 2 === 0,
        installed_ui_devices: Math.floor(Math.random() * 50),
        zones: Array(Math.floor(Math.random() * 5))
            .fill(0)
            .map(() => `zone_test-${Math.floor(Math.random() * 999_999)}`),
        modules: Array(Math.floor(Math.random() * 5))
            .fill(0)
            .map(() => `mod_test-${Math.floor(Math.random() * 999_999)}`),
        settings: {},
        created_at: Math.floor(created / 1000),
        support_url: `/control/${id}`,
        ...overrides,
    };
}
