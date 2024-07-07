import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { ApiService } from '../../../Services/ApiService';
import { OrganizationResponse } from '../../../Utilities/Models';

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
    if (this.loginForm.valid) {
      this.authService.customLogin(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).then(() => {
        console.log('Logged in');
        this.apiService.get<OrganizationResponse>('organization/').subscribe({
          next: (data: OrganizationResponse) => {
            if (data.license != this.loginForm.get('license')?.value) {
              this.authService.logout();
            } else {
              localStorage.setItem('sidenavBackgroundColor', data.colorLeftSideBar);
              localStorage.setItem('toolbarBackgroundColor', data.colorCodeNavBar);
              localStorage.setItem('selectedFont', JSON.stringify({ name: data.font, url: null }));
              localStorage.setItem('organizationName', data.name);
              localStorage.setItem('license', data.license);
              localStorage.setItem('companyVersion', `${data.version}.${data.id}`);
              this.router.navigate(['/Tabloudebord']);
            }
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
}