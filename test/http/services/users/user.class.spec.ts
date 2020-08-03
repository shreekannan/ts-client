
import { PlaceUser } from '../../../../src/http/services/users/user.class';

describe('PlaceUser', () => {
    let user: PlaceUser;
    let service: any;

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        };
        user = new PlaceUser({
            id: 'dep-test',
            authority_id: 'On who\'s authority',
            email: 'jon@tron.game',
            phone: '+612000000000',
            country: 'Australia',
            image: '',
            metadata: 'there be none',
            login_name: 'elitedarklord',
            staff_id: 'PERSON_12345',
            first_name: 'Bob',
            last_name: 'Marley',
            created_at: 999
        });
    });

    it('should create instance', () => {
        expect(user).toBeTruthy();
        expect(user).toBeInstanceOf(PlaceUser);
    });

    it('should expose Authority ID', () => {
        expect(user.authority_id).toBe('On who\'s authority');
    });

    it('should expose Email', () => {
        expect(user.email).toBe('jon@tron.game');
    });

    it('should expose Phone', () => {
        expect(user.phone).toBe('+612000000000');
    });

    it('should expose Country', () => {
        expect(user.country).toBe('Australia');
    });

    it('should expose image', () => {
        expect(user.image).toBe('');
    });

    it('should expose metadata', () => {
        expect(user.metadata).toBe('there be none');
    });

    it('should expose login name', () => {
        expect(user.login_name).toBe('elitedarklord');
    });

    it('should expose staff ID', () => {
        expect(user.staff_id).toBe('PERSON_12345');
    });

    it('should expose first name', () => {
        expect(user.first_name).toBe('Bob');
    });

    it('should expose last name', () => {
        expect(user.last_name).toBe('Marley');
    });
});
