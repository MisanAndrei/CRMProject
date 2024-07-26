import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { decodeToken } from '../Utilities/jwt-decode';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  async customLogin(username: string, password: string): Promise<void> {
    const clientId = 'crm_client'; // Replace with your client ID
    const clientSecret = 'Br6EK5BFIcPFKODVq8CdlPRNsflhG9wG'; // Replace with your client secret
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${basicAuth}`
    });

    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', 'password');

    const url = 'https://backend-crm.efcon.ro/auth/realms/crm/protocol/openid-connect/token'; // Replace with your Keycloak token URL

    try {
      const response: any = await firstValueFrom(this.http.post(url, body.toString(), { headers }));
      localStorage.setItem('access_token', response.access_token);
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.clear();
  }

  async isLoggedIn(): Promise<boolean> {
    var token = localStorage.getItem('access_token');
    if (token == null || token == undefined){
      return false;
    }
    return true;
  }

  getToken(): string | undefined {
    return localStorage.getItem('access_token') ?? undefined;
  }
}