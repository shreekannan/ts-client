/* istanbul ignore next */
/**
 * Generate mocked out repository object metadata
 * @param overrides Map of overrides for top level keys
 */
export function generateMockRepository(overrides: any = {}) {
    if (typeof overrides !== 'object' || !overrides) {
        overrides = {};
    }
    const company = `company${Math.floor(Math.random() * 123)}`;
    const product = `product${Math.floor(Math.random() * 123)}`;
    return {
        id: `repository-${Math.floor(Math.random() * 999_999_999)}`,
        name: `${product}`,
        folder_name: `${company}/${product}`,
        description: `There is a description yes`,
        uri: `https://github.com/placeos/${company}-drivers`,
        commit_hash: 'HEAD',
        repo_type: Math.floor(Math.random() * 999_999_999) % 2,
        ...overrides,
    };
}
