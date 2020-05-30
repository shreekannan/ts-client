import { of } from 'rxjs';

import { PlaceMQTTBroker } from '../../../../src/http/services/broker/broker.class';
import { PlaceMQTTBrokerService } from '../../../../src/http/services/broker/brokers.service';

describe('PlaceMQTTBrokerService', () => {
    let service: PlaceMQTTBrokerService;
    let http: any;

    beforeEach(() => {
        http = {
            responseHeaders: jest.fn(() => ({})),
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            api_endpoint: '/api/engine/v2'
        };
        service = new PlaceMQTTBrokerService(http);
    });

    it('should create instance', () => {
        expect(service).toBeTruthy();
        expect(service).toBeInstanceOf(PlaceMQTTBrokerService);
    });

    it('allow querying systems index', async () => {
        http.get.mockReturnValueOnce(of({ results: [{ id: 'test' }], total: 10 }));
        const result = await service.query();
        expect(http.get).toBeCalledWith('/api/engine/v2/brokers');
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(PlaceMQTTBroker);
    });

    it('allow querying systems show', async () => {
        http.get.mockReturnValueOnce(of({ id: 'test' }));
        const result = await service.show('test');
        expect(http.get).toBeCalledWith('/api/engine/v2/brokers/test');
        expect(result).toBeInstanceOf(PlaceMQTTBroker);
    });
});
