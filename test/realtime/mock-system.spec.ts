import { MockPlaceWebsocketModule } from '../../src/realtime/mock-module';
import { MockPlaceWebsocketSystem } from '../../src/realtime/mock-system';

describe('MockPlaceWebsocketSystem', () => {
    let system: MockPlaceWebsocketSystem;

    beforeEach(() => {
        const system_metadata = {
            Bookings: [
                {
                    test: 10,
                    $method: () => 10,
                    $methodWithOneArg: (arg1: number) => arg1 + 1,
                    $methodWithTwoArgs: (arg1: number, arg2: number) =>
                        arg1 + arg2,
                },
            ],
            Other: [
                {
                    test: 20,
                },
                {
                    test: 11,
                },
            ],
        };
        system = new MockPlaceWebsocketSystem(system_metadata);
    });

    it('should create an instance', () => {
        expect(system).toBeTruthy();
    });

    it('should expose the modules', () => {
        expect(system.Bookings[0]).toBeInstanceOf(MockPlaceWebsocketModule);
        expect(system.Other[0]).toBeInstanceOf(MockPlaceWebsocketModule);
        expect(system.Other[1]).toBeInstanceOf(MockPlaceWebsocketModule);
    });
});
