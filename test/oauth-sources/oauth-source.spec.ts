import { PlaceOAuthSource } from '../../src/oauth-sources/oauth-source';

describe('PlaceOAuthSource', () => {
    let auth_source: PlaceOAuthSource;

    beforeEach(() => {
        auth_source = new PlaceOAuthSource({
            id: 'dep-test',
            authority_id: 'test-authority',
            client_id: 'test',
            created_at: 999,
        });
    });

    it('should create instance', () => {
        expect(auth_source).toBeTruthy();
        expect(auth_source).toBeInstanceOf(PlaceOAuthSource);
    });

    it('should not allow editing the authority ID', () => {
        expect(auth_source.authority_id).toBe('test-authority');
    });

    it('should allow editing fields', () => {
        expect(auth_source.client_id).toBe('test');
    });
});
