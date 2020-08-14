import { of } from 'rxjs';
import { PlaceMQTTBroker } from '../../src/broker/broker';

import * as SERVICE from '../../src/broker/functions';
import * as Resources from '../../src/resources/functions';

describe('MQTT Broker API', () => {
    it('should allow querying brokers', async () => {
        const spy = jest.spyOn(Resources, 'query');
        spy.mockImplementation((_, process: any, __) => of({ data: [process({})] } as any));
        let list = await SERVICE.queryBrokers().toPromise();
        expect(list).toBeTruthy();
        expect(list.data.length).toBe(1);
        expect(list.data[0]).toBeInstanceOf(PlaceMQTTBroker);
        list = await SERVICE.queryBrokers({}).toPromise();
    });

    it('should allow showing broker details', async () => {
        const spy = jest.spyOn(Resources, 'show');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        let item = await SERVICE.showBroker('1').toPromise();
        expect(item).toBeInstanceOf(PlaceMQTTBroker);
        item = await SERVICE.showBroker('1', {}).toPromise();
    });

    it('should allow creating new brokers', async () => {
        const spy = jest.spyOn(Resources, 'create');
        spy.mockImplementation((_, _1, process: any, _2) =>
            of(process({}) as any)
        );
        let item = await SERVICE.addBroker({}).toPromise();
        expect(item).toBeInstanceOf(PlaceMQTTBroker);
        item = await SERVICE.addBroker({}, {}).toPromise();
    });

    it('should allow updating broker details', async () => {
        const spy = jest.spyOn(Resources, 'update');
        spy.mockImplementation((_, _0, _1, _2, process: any, _3) =>
            of(process({}) as any)
        );
        let item = await SERVICE.updateBroker('1', {}).toPromise();
        expect(item).toBeInstanceOf(PlaceMQTTBroker);
        item = await SERVICE.updateBroker('1', {}, {}, 'patch').toPromise();
    });

    it('should allow removing brokers', async () => {
        const spy = jest.spyOn(Resources, 'remove');
        spy.mockImplementation(() => of());
        let item = await SERVICE.removeBroker('1').toPromise();
        expect(item).toBeFalsy();
        item = await SERVICE.removeBroker('1', {}).toPromise();
    });
});
