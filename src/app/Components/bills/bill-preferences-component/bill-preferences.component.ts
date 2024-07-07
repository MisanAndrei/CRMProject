import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../Services/ApiService';
import { InvoicePreferences } from '../../../Utilities/Models';

@Component({
  selector: 'app-bill-preferences',
  templateUrl: './bill-preferences.component.html',
  styleUrls: ['./bill-preferences.component.css']
})
export class BillPreferencesComponent implements OnInit {
  preferencesForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.preferencesForm = this.fb.group({
      prefix: ['', Validators.required],
      nextNumber: [1, [Validators.required, Validators.min(1)]],
      note: [''],
      subantet: [''],
      subsol: ['']
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.apiService.get<InvoicePreferences>('invoice-preferences').subscribe({
      next: (data: InvoicePreferences) => {
        this.preferencesForm.patchValue({
          prefix: data.prefix,
          nextNumber: data.startingNumber,
          note: data.notes,
          subantet: data.subHeader,
          subsol: data.footer
        });
      },
      error: (error) => {
        console.error('Error fetching preferences', error);
      }
    });
  }

  onSubmit(): void {
    if (this.preferencesForm.valid) {
      const updatedPreferences: InvoicePreferences = {
        prefix: this.preferencesForm.get('prefix')?.value,
        startingNumber: this.preferencesForm.get('nextNumber')?.value,
        notes: this.preferencesForm.get('note')?.value,
        subHeader: this.preferencesForm.get('subantet')?.value,
        footer: this.preferencesForm.get('subsol')?.value
      };

      this.apiService.put('invoice-preferences', updatedPreferences).subscribe({
        next: () => {
          console.log('Preferences updated successfully');
        },
        error: (error) => {
          console.error('Error updating preferences', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}