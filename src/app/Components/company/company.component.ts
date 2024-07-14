import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../Services/ApiService'; // Update the path as necessary
import { DOCUMENT } from '@angular/common';
import { Organization } from '../../Utilities/Models';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  selectedNavBarColor: string = '#9dcd8a';
  selectedLeftBarColumn: string = '#9dcd8a';
  imageBase64: string | ArrayBuffer | null = '';
  selectedFont: string = '';
  showChangePassword: boolean = false;
  changePasswordForm: FormGroup;

  @ViewChild('navBarColorInput') navBarColorInput!: ElementRef<HTMLInputElement>;
  @ViewChild('leftBarColumnColorInput') leftBarColumnColorInput!: ElementRef<HTMLInputElement>;

  @ViewChild('colorInput') colorInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cui: ['', Validators.required],
      regCom: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      county: ['', Validators.required],
      country: ['', Validators.required],
      image: [''],
      selectedNavBarColor: [this.selectedNavBarColor],
      selectedLeftBarColumn: [this.selectedLeftBarColumn],
      selectedFont: this.selectedFont
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordsMatch });
  }

  ngOnInit(): void {
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

  openLeftBarColumnColorPicker(): void {
    this.leftBarColumnColorInput.nativeElement.click();
  }

  fetchCompanyDetails(): void {
    this.apiService.get<Organization>('organization/info').subscribe((company) => {
      this.companyForm.patchValue({
        name: company.name,
        email: company.email,
        phone: company.phoneNumber,
        cui: company.cui,
        regCom: company.regCom,
        address: company.address,
        city: company.city,
        postalCode: company.postalCode,
        county: company.county,
        country: company.country,
        selectedFont: company.font,
        selectedNavBarColor: company.colorCodeNavBar,
        selectedLeftBarColumn: company.colorCodeLeftBar,
        image: this.stripBase64Prefix(company.image),
      });
      this.imageBase64 = this.stripBase64Prefix(company.image);
      this.selectedNavBarColor = company.colorCodeNavBar;
      this.selectedLeftBarColumn = company.colorCodeLeftBar;
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
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const companyData: Organization = this.companyForm.value;
      companyData.image = this.stripBase64Prefix(companyData.image);
      this.apiService.put('/company', companyData).subscribe(() => {
        console.log('Company details updated successfully');
      });
    } else {
      console.log('Form is invalid');
    }
  }

  onFontSelected(font: string): void {
    this.selectedFont = font;
    localStorage.setItem('selectedFont', font);
    this.applyFont(font);
  }

  applyFont(fontName: string): void {
    this.renderer.setStyle(this.document.body, 'font-family', fontName);
  }

  openColorPicker(): void {
    this.colorInput.nativeElement.click();
  }

  onChangePasswordSubmit(): void {
    if (this.changePasswordForm.valid) {
      // Handle change password logic here
      console.log('Password changed successfully');
    } else {
      console.log('Password form is invalid');
    }
  }

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
  }
}


