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
  taxes: Tax[] = [];
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
      acquisitionPrice: [0],
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
        this.elementForm.get('acquisitionPrice')!.enable();
      } else {
        this.elementForm.get('acquisitionPrice')!.disable();
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
      this.elementForm.get('acquisitionPrice')!.disable();
    }

    if (!this.elementForm.get('sellingInfo')!.value) {
      this.elementForm.get('sellingPrice')!.disable();
    }
  }

  fetchElementDetails(id: number) {
    this.apiService.get<Element>(`/element/${id}`).subscribe((element) => {
      this.elementForm.patchValue({
        type: element.type === 'Produs' ? ElementType.Produs : ElementType.Serviciu,
        name: element.name,
        selectedCategoryId: element.categoryId,
        description: element.description || '',
        acquisitionPrice: element.acquisitionPrice || 0,
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
        const elementData: Element = {
        type: this.elementForm.get('type')?.value == 1 ? 'Produs' : 'Serviciu',
        name: this.elementForm.get('name')?.value,
        categoryName: this.selectedCategoryName,
        categoryId: this.elementForm.get('selectedCategoryId')?.value,
        description: this.elementForm.get('description')?.value,
        acquisitionPrice: this.elementForm.get('acquisitionPrice')?.value,
        sellingPrice: this.elementForm.get('sellingPrice')?.value,
        taxId: this.elementForm.get('selectedTaxId')?.value,
        taxValue: this.elementForm.get('selectedTaxValue')?.value
      };

      if (this.isEditMode) {
        elementData.id = this.elementId;
        this.apiService.put('financial/element/', elementData).subscribe({
          next: () => {
            console.log('Element updated successfully');
            this.router.navigate(['/Elemente']);
          },
          error: (error) => {
            console.error('Error updating element', error);
          },
        });
      } else {
        this.apiService.post('financial/element/', elementData).subscribe({
          next: () => {
            console.log('Element created successfully');
            this.router.navigate(['/Elemente']);
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
    
    this.apiService.get<Category[]>('financial/category/').subscribe({
      next: (data: Category[]) => {
        this.categories = data.filter(x => x.type == 'element');
        if (this.categories.length == 1){
          this.selectedCategoryName = this.categories[0].name;
          this.elementForm.patchValue({
            selectedCategoryId: this.categories[0].id,
          });
        }
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      },
      complete: () => {
        console.info('categories data fetch complete');
      }
    });
  }
  

  fetchTaxes() {
    this.apiService.get<Tax[]>('financial/tax/').subscribe({
      next: (data: Tax[]) => {
        this.taxes = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      },
      complete: () => {
        console.info('categories data fetch complete');
      }
    });
  }
}
