import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../Services/ApiService'; // Update the path as necessary
import { DOCUMENT } from '@angular/common';
import { ChangePassword, Organization } from '../../Utilities/Models';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '../dialogs/status-dialog-component/status-dialog.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  selectedNavBarColor: string = '#9dcd8a';
  selectedLeftBarColor: string = '#9dcd8a';
  imageBase64: string | ArrayBuffer | null = '';
  font: string = '';
  showChangePassword: boolean = false;
  buttonVisible: boolean = true;
  changePasswordForm: FormGroup;

  @ViewChild('navBarColorInput') navBarColorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftBarColorInput') leftBarColorInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      cui: ['', Validators.required],
      regCom: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      county: ['', Validators.required],
      country: ['', Validators.required],
      image: [null],
      colorCodeNavBar: [this.selectedNavBarColor],
      colorCodeLeftSideBar: [this.selectedLeftBarColor],
      font: this.font
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
    
    this.companyForm.get('colorCodeNavBar')!.valueChanges.subscribe((value: string) => {
      this.selectedNavBarColor = value;
      localStorage.setItem('toolbarBackgroundColor', value);
    });
    this.companyForm.get('colorCodeLeftSideBar')!.valueChanges.subscribe((value: string) => {
      this.selectedLeftBarColor = value;
      localStorage.setItem('sidenavBackgroundColor', value);
    });

    this.fetchCompanyDetails();
  }

  passwordsMatch(formGroup: FormGroup): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const repeatNewPassword = formGroup.get('repeatNewPassword')?.value;
    return newPassword === repeatNewPassword ? null : { mismatch: true };
  }

  openNavBarColorPicker(): void {
    this.navBarColorInput.nativeElement.click();
  }

  openLeftBarColorPicker(): void {
    this.leftBarColorInput.nativeElement.click();
  }

  fetchCompanyDetails(): void {
    this.apiService.get<Organization>('organization/info').subscribe((company) => {
      this.companyForm.patchValue({
        email: company.email,
        phoneNumber: company.phoneNumber,
        cui: company.cui,
        regCom: company.regCom,
        address: company.address,
        city: company.city,
        postalCode: company.postalCode,
        county: company.county,
        country: company.country,
        font: company.font,
        image: company.image,
      });
      this.imageBase64 = `data:image/jpeg;base64,${company.image}`;
      this.font = company.font;
      this.applyFont(company.font);
    });

    this.apiService.get<Organization>('organization/').subscribe((company) => {
      this.companyForm.patchValue({
        name: company.name,
        font: company.font,
        colorCodeNavBar: company.colorCodeNavBar,
        colorCodeLeftSideBar: company.colorCodeLeftSideBar,
      });
      this.selectedNavBarColor = company.colorCodeNavBar;
      this.selectedLeftBarColor = company.colorCodeLeftSideBar;
      this.applyFont(company.font);
    });
  }

  stripBase64Prefix(base64String: string): string {
    if (base64String) {
      return base64String.split(',')[1] || base64String;
    }
    return '';
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = this.stripBase64Prefix(reader.result as string);
        this.companyForm.patchValue({ image: this.imageBase64 });
        this.imageBase64 = `data:image/jpeg;base64,${this.imageBase64}`;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const companyData: Organization = this.companyForm.value;
      companyData.font = this.font;
      if (companyData.image == ''){
        companyData.image = undefined;
      }
      this.apiService.put('organization/', companyData).subscribe({
        next: () => {
          this.dialog.open(StatusDialogComponent, {
            data: {
              message: 'Modificarile au fost salvate cu succes !',
              status: 'success' // You can change this to 'failure' as needed
            }
          });
        },
        error: (error) => {
          this.dialog.open(StatusDialogComponent, {
            data: {
              message: 'Modificarile nu au fost salvate, verificati toate campurile !',
              status: 'failure'
            }
          });
        },
        complete: () => {
          console.info('Transaction creation complete');
        }
      });
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  onFontSelected(font: string): void {
    this.font = font;
    localStorage.setItem('selectedFont', font);
    this.companyForm.patchValue({
      font: font
    });
    this.applyFont(font);
  }

  applyFont(fontName: string): void {
    this.renderer.setStyle(this.document.body, 'font-family', fontName);
  }

  onChangePasswordSubmit(): void {
    if (this.changePasswordForm.valid) {
      // Handle change password logic here
      const changePasswordData: ChangePassword = {
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };
      this.apiService.put(`user/password`, changePasswordData).subscribe({
        next: () => {
          this.dialog.open(StatusDialogComponent, {
            data: {
              message: 'Parola a fost modificata cu succes !',
              status: 'success' // You can change this to 'failure' as needed
            }
          });
        },
        error: (error) => {
          this.dialog.open(StatusDialogComponent, {
            data: {
              message: 'Modificarile nu au fost salvate, verificati toate campurile !',
              status: 'failure'
            }
          });
        }
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.buttonVisible = false;
  }
}


