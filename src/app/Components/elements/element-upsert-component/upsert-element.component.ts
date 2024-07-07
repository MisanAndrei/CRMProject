import { Component, OnInit } from '@angular/core';
import { ElementType } from '../../../Utilities/Enums';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/ApiService';
import { Category, Element, Tax } from '../../../Utilities/Models';

@Component({
  selector: 'app-upsert-element',
  templateUrl: './upsert-element.component.html',
  styleUrls: ['./upsert-element.component.css'],
})
export class UpsertElementComponent implements OnInit {
  elementForm: FormGroup;
  categories: Category[] = [];
  taxes: Tax[] = [
    { id: 1, name: 'Tax 1', value: 25 },
    { id: 2, name: 'Tax 2', value: 35 },
  ];
  elementId?: number;
  isEditMode = false;
  selectedCategoryName: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.elementForm = this.fb.group({
      type: [ElementType.Produs, Validators.required],
      name: ['', Validators.required],
      selectedCategoryId: [0, Validators.required],
      description: [''],
      acquireInfo: [true],
      sellingInfo: [false],
      aquisitionPrice: [0],
      sellingPrice: [{ value: 0, disabled: true }],
      selectedTaxId: [0],
      selectedTaxValue: [0],
    });

    this.setupFormListeners();
  }

  ngOnInit(): void {
    this.elementId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.elementId;

    this.fetchCategories();
    this.fetchTaxes();

    if (this.isEditMode) {
      this.fetchElementDetails(this.elementId);
    }
  }

  private setupFormListeners() {
    this.elementForm.get('acquireInfo')!.valueChanges.subscribe((value) => {
      if (value) {
        this.elementForm.get('aquisitionPrice')!.enable();
      } else {
        this.elementForm.get('aquisitionPrice')!.disable();
      }
    });

    this.elementForm.get('sellingInfo')!.valueChanges.subscribe((value) => {
      if (value) {
        this.elementForm.get('sellingPrice')!.enable();
      } else {
        this.elementForm.get('sellingPrice')!.disable();
      }
    });

    // Initialize state based on the current values
    if (!this.elementForm.get('acquireInfo')!.value) {
      this.elementForm.get('aquisitionPrice')!.disable();
    }

    if (!this.elementForm.get('sellingInfo')!.value) {
      this.elementForm.get('sellingPrice')!.disable();
    }
  }

  fetchElementDetails(id: number) {
    this.apiService.get<Element>(`/elements/${id}`).subscribe((element) => {
      this.elementForm.patchValue({
        type: element.type === 'Produs' ? ElementType.Produs : ElementType.Serviciu,
        name: element.name,
        selectedCategoryId: element.categoryId,
        description: element.description || '',
        aquisitionPrice: element.aquisitionPrice || 0,
        sellingPrice: element.sellingPrice || 0,
        selectedTaxId: element.taxId ?? 0,
        selectedTaxValue: element.taxValue ?? 0,
      });

      this.selectedCategoryName = element.categoryName;
    });
  }

  onTaxRemoved(tax: Tax) {
    const taxes = this.elementForm.get('selectedTaxId')!.value as Tax[];
    this.removeFirst(taxes, tax);
    this.elementForm.patchValue({ selectedTaxId: taxes }); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  toggleAcquireInfo() {
    if (!this.elementForm.get('acquireInfo')!.value) {
      this.elementForm.patchValue({ sellingInfo: true });
    }
  }

  toggleSellingInfo() {
    if (!this.elementForm.get('sellingInfo')!.value) {
      this.elementForm.patchValue({ acquireInfo: true });
    }
  }

  onTaxSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const taxId = Number(selectElement.value);
    const selectedTax = this.taxes.find((tax) => tax.id === taxId);
    if (selectedTax) {
      this.elementForm.patchValue({
        selectedTaxId: selectedTax.id,
        selectedTaxValue: selectedTax.value,
      });
    }
  }

  onCategorySelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = Number(selectElement.value);
    const selectedCategory = this.categories.find(
      (category) => category.id === categoryId
    );
    if (selectedCategory) {
      this.elementForm.patchValue({
        selectedCategoryId: selectedCategory.id,
      });
      this.selectedCategoryName = selectedCategory.name;
    }
  }

  saveElement() {
    if (this.elementForm.valid) {
      const elementData = {
        ...this.elementForm.value,
        categoryName: this.selectedCategoryName,
      } as Element;

      if (this.isEditMode) {
        this.apiService.put('financial/element', elementData).subscribe({
          next: () => {
            console.log('Element updated successfully');
            this.router.navigate(['/elements']);
          },
          error: (error) => {
            console.error('Error updating element', error);
          },
        });
      } else {
        this.apiService.post('financial/element', elementData).subscribe({
          next: () => {
            console.log('Element created successfully');
            this.router.navigate(['/elements']);
          },
          error: (error) => {
            console.error('Error creating element', error);
          },
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  fetchCategories() {
    // Replace with API call
    this.categories = [
      { id: 1, name: 'Category 1', type: 'Type 1', colorCode: '#FF0000' },
      { id: 2, name: 'Category 2', type: 'Type 2', colorCode: '#00FF00' },
    ];
  }

  fetchTaxes() {
    // Replace with API call
    this.taxes = [
      { id: 1, name: 'Tax 1', type: 'Type 1', value: 5 },
      { id: 2, name: 'Tax 2', type: 'Type 2', value: 10 },
    ];
  }
}
