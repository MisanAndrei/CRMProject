import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { ApiService } from '../../../Services/ApiService';
import { Organization, OrganizationResponse } from '../../../Utilities/Models';
import { switchMap } from 'rxjs';
import { RefreshService } from '../../../Services/RefreshService';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '../../dialogs/status-dialog-component/status-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog, private router: Router, private authService: AuthService, private apiService: ApiService, private refreshService: RefreshService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      license: ['', [Validators.required]],
      rememberMe: [false]
    });
  }
  async ngOnInit(): Promise<void> {
    if (await this.authService.isLoggedIn()){
      this.router.navigate(['/Tabloudebord']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.customLogin(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).then(() => {
        console.log('Logged in');
        this.apiService.get<OrganizationResponse>('organization/').pipe(
          switchMap((data: OrganizationResponse) => {
            if (data.license != this.loginForm.get('license')?.value) {
              this.authService.logout();
              this.dialog.open(StatusDialogComponent, {
                data: {
                  message: 'Licenta introdusa nu este valida, incercati din nou !',
                  status: 'failure'
                }
              });
              throw new Error('Invalid license');
            } else {
              localStorage.setItem('sidenavBackgroundColor', data.colorCodeLeftSideBar);
              localStorage.setItem('toolbarBackgroundColor', data.colorCodeNavBar);
              localStorage.setItem('selectedFont', data.font);
              localStorage.setItem('organizationName', data.name);
              localStorage.setItem('license', data.license);
              localStorage.setItem('companyVersion', `4.${data.id}`);
              return this.apiService.get<Organization>('organization/info');
            }
          })
        ).subscribe({
          next: (orgInfo: Organization) => {
            localStorage.setItem('organizationImage', orgInfo.image ?? '');
            this.refreshService.triggerRefresh();
            this.router.navigate(['/Tabloudebord']);
          },
          error: (error) => {
            console.error('Error fetching organization info', error);
          },
          complete: () => {
            console.info('Organization info fetch complete');
          }
        });
      }).catch((error) => {
        console.error('Login failed', error);
      });
    }
  }
}