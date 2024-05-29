import { Component } from '@angular/core';
import { AuthService } from '../../Services/Auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.customLogin(this.username, this.password).then(() => {
      console.log('Logged in');
    }).catch((error) => {
      console.error('Login failed', error);
    });
  }
}