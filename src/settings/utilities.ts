import { startOfMinute, sub } from 'date-fns';

/**
 * Generate mocked out settings object metadata
 * @param overrides Map of overrides for top level keys
 */
export function generateMockSettings(overrides: any = {}) {
    if (typeof overrides !== 'object' || !overrides) {
        overrides = {};
    }
    const parent_types = ['zone', 'sys', 'mod', 'driver'];
    const created = sub(startOfMinute(new Date()), {
        minutes: Math.floor(Math.random() * 99) * 15,
    }).getTime();
    return {
        id: `setting-${Math.floor(Math.random() * 999_999_999)}`,
        parent_id: `${
            parent_types[Math.floor(Math.random() * parent_types.length)]
        }-${Math.floor(Math.random() * 999_999_999)}`,
        created_at: Math.floor(created / 1000),
        updated_at: Math.floor(
            created / 1000 + Math.floor(Math.random() * 20) * 15 * 60
        ),
        encryption_level: Math.floor(Math.random() * 4),
        settings_string: '',
        keys: [],
        ...overrides,
    };
}
