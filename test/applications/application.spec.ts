import { PlaceApplication } from '../../src/applications/application';

describe('PlaceApplication', () => {
    let application: PlaceApplication;

    beforeEach(() => {
        application = new PlaceApplication({
            id: 'dep-test',
            owner_id: 'test-man',
            uid: 'no-so-unique',
            secret: "Shhh... It's a secret",
            scopes: 'office,building,over,there',
            redirect_uri: 'https://over.yonder/oauth.html',
            skip_authorization: true,
            created_at: 999,
        });
    });

    it('should create instance', () => {
        expect(application).toBeTruthy();
        expect(application).toBeInstanceOf(PlaceApplication);
    });

    it('should expose owner ID', () => {
        expect(application.owner_id).toBe('test-man');
    });

    it('should expose scopes', () => {
        expect(application.scopes).toBe('office,building,over,there');
    });

    it('should expose redirect_uri', () => {
        expect(application.redirect_uri).toBe('https://over.yonder/oauth.html');
    });

    it('should expose skip_authorization', () => {
        expect(application.skip_authorization).toBe(true);
    });

    it('should expose unique ID', () => {
        expect(application.uid).toBe('no-so-unique');
    });

    it('should expose secret', () => {
        expect(application.secret).toBe("Shhh... It's a secret");
    });
});
