import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://backend-crm.efcon.ro/auth',  // Update with your Keycloak server URL
        realm: 'crm',  // Replace with your realm name
        clientId: 'crm_client',  // Replace with your client ID
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}