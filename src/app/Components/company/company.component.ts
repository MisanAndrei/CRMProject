import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../Services/ApiService'; // Update the path as necessary

interface Organization {
  name: string;
  email: string;
  phone: string;
  cui: string;
  address: string;
  city: string;
  image: string;
  postalCode: string;
  county: string;
  country: string;
}

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  selectedColor: string = '#7abf95';
  imageBase64: string | ArrayBuffer | null = '';

  @ViewChild('colorInput') colorInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cui: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      county: ['', Validators.required],
      country: ['', Validators.required],
      image: [''],
      selectedColor: [this.selectedColor]
    });
  }

  ngOnInit(): void {
    this.companyForm.get('selectedColor')!.valueChanges.subscribe((value:string) => {
      this.selectedColor = value;
    })

    this.fetchCompanyDetails();
  }

  openColorPicker(): void {
    this.colorInput.nativeElement.click();
  }

  fetchCompanyDetails(): void {
    this.apiService.get<Organization>('/company').subscribe((company) => {
      this.companyForm.patchValue({
        name: company.name,
        email: company.email,
        phone: company.phone,
        cui: company.cui,
        address: company.address,
        city: company.city,
        postalCode: company.postalCode,
        county: company.county,
        country: company.country,
        image: this.stripBase64Prefix(company.image)
      });
      this.imageBase64 = this.stripBase64Prefix(company.image);
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
}