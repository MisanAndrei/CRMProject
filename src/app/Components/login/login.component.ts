import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { ApiService } from '../../Services/ApiService';
import { Organization } from '../../Utilities/Models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private apiService: ApiService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      license: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    this.authService.customLogin(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).then(() => {
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