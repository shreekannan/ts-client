
import { PlaceZone } from '../../../../src/http/services/zones/zone.class';

describe('PlaceZone', () => {
    let zone: PlaceZone;
    let service: any;

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            listMetadata: jest.fn(),
            listChildMetadata: jest.fn()
        };
        zone = new PlaceZone({
            id: 'dep-test',
            description: 'In a galaxy far far away...',
            settings: { settings_string: '{ today: false, future: \'Yeah!\' }' },
            triggers: ['trig-001'],
            created_at: 999,
            trigger_data: [{ id: 'trig-01', name: 'A trigger' }]
        });
    });

    it('should create instance', () => {
        expect(zone).toBeTruthy();
        expect(zone).toBeInstanceOf(PlaceZone);
    });

    it('should have trigger data', (done) => {
        setTimeout(() => {
            expect(zone.trigger_list).toBeTruthy();
            expect(zone.trigger_list.length).toBe(1);
            done();
        }, 1);
    });

    it('should expose description', () => {
        expect(zone.description).toBe('In a galaxy far far away...');
    });

    it('should expose settings', () => {
        expect(zone.settings).toBeInstanceOf(Object);
    });

    it('should expose triggers', () => {
        expect(zone.triggers).toEqual(['trig-001']);
    });

    it('should expose class name', () => {
        expect(zone.created_at).toEqual(999);
    });

});
