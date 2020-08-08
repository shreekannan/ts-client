import {
    AuthType,
    PlaceMQTTBroker,
} from '../../src/broker/broker';

describe('PlaceMQTTBroker', () => {
    let broker: PlaceMQTTBroker;

    beforeEach(() => {
        broker = new PlaceMQTTBroker({
            id: 'dep-test',
            name: 'here.today',
            auth_type: AuthType.Certificate,
            host: 'broker.place.tech',
            port: 12345,
            tls: true,
            username: 'user',
            password: 'pass',
            certificate: 'cert',
            secret: 'secret :)',
            filters: ['Test'],
            description: 'In a galaxy far far away...',
            created_at: 999,
        });
    });

    it('should create instance', () => {
        expect(broker).toBeTruthy();
        expect(broker).toBeInstanceOf(PlaceMQTTBroker);
    });

    it('should expose properties', () => {
        expect(broker.host).toBe('broker.place.tech');
        expect(broker.port).toBe(12345);
        expect(broker.tls).toBeTruthy();
        expect(broker.username).toBe('user');
        expect(broker.password).toBe('pass');
        expect(broker.certificate).toBe('cert');
        expect(broker.secret).toBe('secret :)');
        expect(broker.filters).toEqual(['Test']);
        expect(broker.description).toBe('In a galaxy far far away...');
    });

    it('should allow converting to JSON object', () => {
        expect(broker.toJSON()).toBeTruthy();
    });
});
