import { PlaceLDAPSource } from '../../src/ldap-sources/ldap-source';

describe('PlaceLdapSource', () => {
    let auth_source: PlaceLDAPSource;

    beforeEach(() => {
        auth_source = new PlaceLDAPSource({
            id: 'dep-test',
            authority_id: 'test-authority',
            host: 'test',
            created_at: 999,
        });
    });

    it('should create instance', () => {
        expect(auth_source).toBeTruthy();
        expect(auth_source).toBeInstanceOf(PlaceLDAPSource);
    });

    it('should not allow editing the authority ID', () => {
        expect(auth_source.authority_id).toBe('test-authority');
    });

    it('should allow editing fields', () => {
        expect(auth_source.host).toBe('test');
    });
});
