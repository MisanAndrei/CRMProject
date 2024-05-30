import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/ApiService'; // Update the path as necessary
import { Partner } from '../../../Utilities/Models'; // Update the path as necessary

@Component({
  selector: 'app-partner-upsert',
  templateUrl: './partner-upsert.component.html',
  styleUrls: ['./partner-upsert.component.css']
})
export class PartnerUpsertComponent implements OnInit {
  partnerForm: FormGroup;
  imageBase64: string | ArrayBuffer | null = '';
  partnerId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.partnerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      website: [''],
      reference: [''],
      image: [''],
      cui: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      county: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.partnerId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.partnerId;

    if (this.isEditMode) {
      this.fetchPartnerDetails(this.partnerId);
    }
  }

  fetchPartnerDetails(id: number): void {
    this.apiService.get<Partner>(`/partners/${id}`).subscribe((partner) => {
      this.partnerForm.patchValue({
        name: partner.name,
        email: partner.email,
        phone: partner.phoneNumber,
        website: partner.website,
        reference: partner.reference,
        image: partner.image,
        cui: partner.cui,
        address: partner.address,
        postalCode: partner.postalCode,
        county: partner.county,
        country: partner.country,
        city: partner.city
      });
      this.imageBase64 = partner.image ?? '';
    });
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = this.stripBase64Prefix(reader.result as string);
        this.partnerForm.patchValue({ image: this.imageBase64 });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  stripBase64Prefix(base64String: string): string {
    if (base64String) {
      return base64String.split(',')[1] || base64String;
    }
    return '';
  }

  onSubmit(): void {
    if (this.partnerForm.valid) {
      const partnerData = this.partnerForm.value;
      if (this.isEditMode) {
        this.apiService.put(`/partners/${this.partnerId}`, partnerData).subscribe(() => {
          this.router.navigate(['/partners']);
        });
      } else {
        this.apiService.post('/partners', partnerData).subscribe(() => {
          this.router.navigate(['/partners']);
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }
}