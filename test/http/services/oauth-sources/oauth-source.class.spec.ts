import { EngineOAuthSource } from '../../../../src/http/services/oauth-sources/oauth-source.class';

describe('EngineOAuthSource', () => {
    let auth_source: EngineOAuthSource;
    let service: any;

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        };
        auth_source = new EngineOAuthSource(service, {
            id: 'dep-test',
            authority_id: 'test-authority',
            client_id: 'test',
            created_at: 999
        });
    });

    it('should create instance', () => {
        expect(auth_source).toBeTruthy();
        expect(auth_source).toBeInstanceOf(EngineOAuthSource);
    });

    it('should not allow editing the authority ID', () => {
        expect(auth_source.authority_id).toBe('test-authority');
        expect(() => auth_source.storePendingChange('authority_id', 'not-test-authority')).toThrowError();
    });

    it('should allow editing fields', () => {
        expect(auth_source.client_id).toBe('test');
        auth_source.storePendingChange('client_id', 'not-test');
        expect(auth_source.client_id).not.toBe('not-test');
        expect(auth_source.changes.client_id).toBe('not-test');
    });
});
