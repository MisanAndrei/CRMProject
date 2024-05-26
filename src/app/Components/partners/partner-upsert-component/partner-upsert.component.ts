import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-partner-upsert',
  templateUrl: './partner-upsert.component.html',
  styleUrls: ['./partner-upsert.component.css']
})
export class PartnerUpsertComponent implements OnInit {
  partnerForm: FormGroup;
  imageBase64: string | ArrayBuffer | null = '';

  constructor(private fb: FormBuilder) {
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
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result;
        this.partnerForm.patchValue({ image: this.imageBase64 });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.partnerForm.valid) {
      console.log(this.partnerForm.value);
      // Handle form submission logic here, such as saving partner data to a server
    } else {
      console.log('Form is invalid');
    }
  }
}