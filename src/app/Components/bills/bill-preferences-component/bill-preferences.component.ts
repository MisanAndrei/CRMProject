import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../Services/ApiService';
import { InvoicePreferences } from '../../../Utilities/Models';
import { MatDialog } from '@angular/material/dialog';
import { StatusDialogComponent } from '../../dialogs/status-dialog-component/status-dialog.component';

@Component({
  selector: 'app-bill-preferences',
  templateUrl: './bill-preferences.component.html',
  styleUrls: ['./bill-preferences.component.css']
})
export class BillPreferencesComponent implements OnInit {
  preferencesForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService, private dialog: MatDialog) {
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
    this.apiService.get<InvoicePreferences>('organization/invoice-preferences').subscribe({
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
          this.dialog.open(StatusDialogComponent, {
            data: {
              message: 'Modificarile au fost salvate cu succes !',
              status: 'success' // You can change this to 'failure' as needed
            }
          });
          console.log('Preferences updated successfully');
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
      this.preferencesForm.markAllAsTouched();
    }
  }
}