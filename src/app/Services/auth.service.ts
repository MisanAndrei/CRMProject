import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakInstance } from 'keycloak-js';
import { decodeToken } from '../Utilities/jwt-decode';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakInstance: KeycloakInstance;

  constructor(private keycloakService: KeycloakService, private http: HttpClient) {
    this.keycloakInstance = keycloakService.getKeycloakInstance();
  }

  async initKeycloak(): Promise<void> {
    if (!this.keycloakInstance.authenticated) {
      await this.keycloakService.init({
        config: {
          url: 'http://localhost:8080/auth', // Update with your Keycloak server URL
          realm: 'your-realm', // Replace with your realm name
          clientId: 'your-client-id', // Replace with your client ID
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        },
      });
    }
  }

  async customLogin(username: string, password: string): Promise<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('client_id', 'crm_client'); // Replace with your client ID
    body.set('client_secret', 'Weu1BgfKQZpj0h4KjIicOUMevtXiO4rF');
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', 'password');

    const url = 'http://localhost:8890/realms/crm/protocol/openid-connect/token'; // Replace with your Keycloak token URL

    try {
      const response: any = await firstValueFrom(this.http.post(url, body.toString(), { headers }));
      this.keycloakInstance.token = response.access_token;
      this.keycloakInstance.refreshToken = response.refresh_token;
      this.keycloakInstance.idToken = response.id_token;
      this.keycloakInstance.tokenParsed = decodeToken(response.access_token);
      this.keycloakInstance.refreshTokenParsed = decodeToken(response.refresh_token);
      this.keycloakInstance.onAuthSuccess && this.keycloakInstance.onAuthSuccess();
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  logout(): Promise<void> {
    return this.keycloakService.logout();
  }

  async isLoggedIn(): Promise<boolean> {
    await this.initKeycloak();
    return await this.keycloakService.isLoggedIn();
  }

  getToken(): string | undefined {
    return this.keycloakService.getKeycloakInstance().token;
  }
}