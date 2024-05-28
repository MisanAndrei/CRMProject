/*import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  login(): Promise<void> {
    return this.keycloakService.login();
  }

  logout(): Promise<void> {
    return this.keycloakService.logout();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  getToken(): string | undefined {
    return this.keycloakService.getKeycloakInstance().token;
  }
}*/