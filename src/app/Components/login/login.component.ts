import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { ApiService } from '../../Services/ApiService';
import { Organization } from '../../Utilities/Models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private apiService: ApiService) {}

  login(): void {
    this.authService.customLogin(this.username, this.password).then(() => {
      console.log('Logged in');
      this.apiService.getOrganization().subscribe({
        next: (data: Organization) => {
          
          console.log(data);
        },
        error: (error) => {
          console.error('Error fetching organization', error);
        },
        complete: () => {
          console.info('Organization data fetch complete');
        }
      });
    }).catch((error) => {
      console.error('Login failed', error);
    });
  }
}