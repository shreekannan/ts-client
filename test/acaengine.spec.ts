import { of } from 'rxjs';

import { PlaceOS } from '../src/placeos';
import { engine } from '../src/auth/auth.service';

import { EngineAuthority } from '../src/auth/auth.interfaces';
import { EngineHttpClient } from '../src/http/http.service';
import { MockEngineHttpClient } from '../src/http/mock/mock-http.service';
import { EngineApplicationsService } from '../src/http/services/applications/applications.service';
import { EngineDomainsService } from '../src/http/services/domains/domains.service';
import { EngineDriversService } from '../src/http/services/drivers/drivers.service';
import { EngineModulesService } from '../src/http/services/modules/modules.service';
import { EngineRepositoriesService } from '../src/http/services/repositories/repositories.service';
import { EngineSettingsService } from '../src/http/services/settings/settings.service';
import { EngineSystemsService } from '../src/http/services/systems/systems.service';
import { EngineSystemTriggersService } from '../src/http/services/triggers/system-triggers.service';
import { EngineTriggersService } from '../src/http/services/triggers/triggers.service';
import { EngineUsersService } from '../src/http/services/users/users.service';
import { EngineZonesService } from '../src/http/services/zones/zones.service';
import { EngineBindingService } from '../src/websocket/binding.service';
import { MockEngineWebsocket } from '../src/websocket/mock/mock-websocket.class';
import { EngineWebsocket } from '../src/websocket/websocket.class';

import { EngineLDAPSourcesService } from '../src/http/services/ldap-sources/ldap-sources.service';
import { EngineOAuthSourcesService } from '../src/http/services/oauth-sources/oauth-sources.service';
import { EngineSAMLSourcesService } from '../src/http/services/saml-sources/saml-sources.service';

describe('PlaceOS', () => {
    it('constuctor throws error', () => {
        expect(() => new PlaceOS()).toThrow();
    });

    it('services throw errors before intialisation', () => {
        expect(() => PlaceOS.auth).toThrow();
        expect(() => PlaceOS.applications).toThrow();
        expect(() => PlaceOS.oauth_sources).toThrow();
        expect(() => PlaceOS.saml_sources).toThrow();
        expect(() => PlaceOS.ldap_sources).toThrow();
        expect(() => PlaceOS.bindings).toThrow();
        expect(() => PlaceOS.domains).toThrow();
        expect(() => PlaceOS.drivers).toThrow();
        expect(() => PlaceOS.http).toThrow();
        expect(() => PlaceOS.modules).toThrow();
        expect(() => PlaceOS.realtime).toThrow();
        expect(() => PlaceOS.systems).toThrow();
        expect(() => PlaceOS.users).toThrow();
        expect(() => PlaceOS.zones).toThrow();
    });

    describe('services', () => {
        let authority: EngineAuthority;
        let spy: jest.SpyInstance;

        beforeEach(() => {
            authority = {
                id: 'test-authority',
                name: 'localhost:4200',
                description: '',
                dom: 'localhost:4200',
                login_url: `/login?continue={{url}}`,
                logout_url: `/logout`,
                session: false,
                production: false,
                config: {}
            };
            window.history.pushState({}, 'Test PlaceOS', '?access_token=hello&expires_in=3600');
            spy = jest.spyOn(engine.ajax, 'get');
            spy.mockImplementation(() => of({ response: authority }));
            jest.useFakeTimers();
            PlaceOS.init({
                auth_uri: '/auth/oauth/authorize',
                token_uri: '/auth/token',
                redirect_uri: 'http://localhost:8080/oauth-resp.html',
                scope: 'any'
            });
            jest.runOnlyPendingTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should initialise', () => {
            expect(PlaceOS.is_initialised).toBe(true);
        });

        it('should expose realtime API services', () => {
            expect(PlaceOS.bindings).toBeInstanceOf(EngineBindingService);
            expect(PlaceOS.realtime).toBeInstanceOf(EngineWebsocket);
        });

        it('should expose HTTP API services', () => {
            expect(PlaceOS.http).toBeInstanceOf(EngineHttpClient);
            expect(PlaceOS.applications).toBeInstanceOf(EngineApplicationsService);
            expect(PlaceOS.oauth_sources).toBeInstanceOf(EngineOAuthSourcesService);
            expect(PlaceOS.saml_sources).toBeInstanceOf(EngineSAMLSourcesService);
            expect(PlaceOS.ldap_sources).toBeInstanceOf(EngineLDAPSourcesService);
            expect(PlaceOS.domains).toBeInstanceOf(EngineDomainsService);
            expect(PlaceOS.drivers).toBeInstanceOf(EngineDriversService);
            expect(PlaceOS.modules).toBeInstanceOf(EngineModulesService);
            expect(PlaceOS.repositories).toBeInstanceOf(EngineRepositoriesService);
            expect(PlaceOS.settings).toBeInstanceOf(EngineSettingsService);
            expect(PlaceOS.systems).toBeInstanceOf(EngineSystemsService);
            expect(PlaceOS.system_triggers).toBeInstanceOf(EngineSystemTriggersService);
            expect(PlaceOS.triggers).toBeInstanceOf(EngineTriggersService);
            expect(PlaceOS.users).toBeInstanceOf(EngineUsersService);
            expect(PlaceOS.zones).toBeInstanceOf(EngineZonesService);
        });
    });

    describe('mocking services', () => {
        let authority: EngineAuthority;
        let spy: jest.SpyInstance;

        beforeEach(() => {
            authority = {
                id: 'test-authority',
                name: 'localhost:4200',
                description: '',
                dom: 'localhost:4200',
                login_url: `/login?continue={{url}}`,
                logout_url: `/logout`,
                session: false,
                production: false,
                config: {}
            };
            window.history.pushState({}, 'Test PlaceOS', '?access_token=hello&expires_in=3600');
            spy = jest.spyOn(engine.ajax, 'get');
            spy.mockImplementation(() => of({ response: authority }));
            jest.useFakeTimers();
            PlaceOS.init({
                auth_uri: '/auth/oauth/authorize',
                token_uri: '/auth/token',
                redirect_uri: 'http://localhost:8080/oauth-resp.html',
                scope: 'any',
                mock: true
            });
            jest.runOnlyPendingTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it('should be using mock services', () => {
            expect(PlaceOS.http).toBeInstanceOf(MockEngineHttpClient);
            expect(PlaceOS.realtime).toBeInstanceOf(MockEngineWebsocket);
        });
    });
});
