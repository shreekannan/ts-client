import { PlaceDomain } from '../../../../src/http/services/domains/domain.class';

describe('PlaceDomain', () => {
    let domain: PlaceDomain;

    beforeEach(() => {
        domain = new PlaceDomain({
            id: 'dep-test',
            domain: 'here.today',
            login_url: 'somewhere.today',
            logout_url: 'no-where.today',
            description: 'In a galaxy far far away...',
            config: JSON.stringify({ today: false, future: 'Yeah!' }),
            internals: JSON.stringify({ today: true, future: 'Nope!' }),
            created_at: 999
        });
    });

    it('should create instance', () => {
        expect(domain).toBeTruthy();
        expect(domain).toBeInstanceOf(PlaceDomain);
    });

    it('should expose domain', () => {
        expect(domain.domain).toBe('here.today');
    });

    it('should expose login URL', () => {
        expect(domain.login_url).toBe('somewhere.today');
    });

    it('should expose logout URL', () => {
        expect(domain.logout_url).toBe('no-where.today');
    });

    it('should expose description', () => {
        expect(domain.description).toBe('In a galaxy far far away...');
    });

    it('should expose config', () => {
        expect(domain.config).toEqual(JSON.stringify({ today: false, future: 'Yeah!' }));
    });

    it('should expose internals', () => {
        expect(domain.internals).toEqual(JSON.stringify({ today: true, future: 'Nope!' }));
    });

    it('should allow converting to JSON object', () => {
        expect(domain.toJSON()).toBeTruthy();
    });
});
