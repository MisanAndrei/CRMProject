import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../Services/ApiService';
import { Tax } from '../../../../Utilities/Models';

interface Type {
  id: number;
  name: string;
}

@Component({
  selector: 'app-taxes-upsert',
  templateUrl: './taxes-upsert.component.html',
  styleUrls: ['./taxes-upsert.component.css']
})
export class TaxesUpsertComponent implements OnInit {
  typeForm: FormGroup;
  isEditMode = false;
  taxId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.typeForm = this.fb.group({
      name: ['', Validators.required],
      tax: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.taxId = +id;
        this.loadTaxData(this.taxId);
      }
    });
  }

  loadTaxData(id: number): void {
    this.apiService.get<Tax>(`financial/tax/${id}`).subscribe({
      next: (tax: Tax) => {
        this.typeForm.patchValue({
          name: tax.name,
          tax: tax.value
        });
      },
      error: (error) => {
        console.error('Error fetching tax data', error);
      }
    });
  }

  onSubmit(): void {
    if (this.typeForm.valid) {
      const formValue = this.typeForm.value;
      const tax: Tax = {
        name: formValue.name,
        value: formValue.tax
      };

      if (this.isEditMode && this.taxId) {
        tax.id = this.taxId;
        this.apiService.put(`financial/tax/`, tax).subscribe({
          next: () => {
            console.log('Tax updated successfully');
            this.router.navigate(['/Taxe']);
          },
          error: (error) => {
            console.error('Error updating tax', error);
          }
        });
      } else {
        this.apiService.post('financial/tax/', tax).subscribe({
          next: () => {
            console.log('Tax created successfully');
            this.router.navigate(['/Taxe']);
          },
          error: (error) => {
            console.error('Error creating tax', error);
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }
}