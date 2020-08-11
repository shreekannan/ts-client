import { PlaceSAMLSource } from '../../src/saml-sources/saml-source';

describe('PlaceSamlSource', () => {
    let auth_source: PlaceSAMLSource;

    beforeEach(() => {
        auth_source = new PlaceSAMLSource({
            id: 'dep-test',
            authority_id: 'test-authority',
            idp_cert: 'test',
            created_at: 999,
        });
    });

    it('should create instance', () => {
        expect(auth_source).toBeTruthy();
        expect(auth_source).toBeInstanceOf(PlaceSAMLSource);
    });

    it('should not allow editing the authority ID', () => {
        expect(auth_source.authority_id).toBe('test-authority');
    });

    it('should allow editing fields', () => {
        expect(auth_source.idp_cert).toBe('test');
    });
});
