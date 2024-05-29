import { Component } from '@angular/core';
import { ElementType } from '../../../Utilities/Enums';
import { Category, Element, Tax } from '../../../Utilities/Models';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/ApiService';

@Component({
  selector: 'app-upsert-element',
  templateUrl: './upsert-element.component.html',
  styleUrls: ['./upsert-element.component.css'],
})
export class UpsertElementComponent {
  type: ElementType = ElementType.Produs; // Default to Product
  name: string = '';
  selectedCategoryName: string = '';
  selectedCategoryId: number = 0;
  description: string = '';
  acquireInfo: boolean = true;
  sellingInfo: boolean = false;
  aquisitionPrice: number = 0;
  sellingPrice: number = 0;
  selectedTaxId: number = 0;
  selectedTaxValue: number = 0;
  categories: Category[] = [];

  elementId?: number;
  isEditMode = false;

  taxes: Tax[] = [
    { id: 1, name: 'Tax 1', value: 25 },
    { id: 2, name: 'Tax 2', value: 35 },
  ];

  selectedTax: Tax | undefined;

  taxesControl = new FormControl<Tax[]>([]);

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.elementId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.elementId;

    this.fetchCategories();
    this.fetchTaxes();

    if (this.isEditMode) {
      this.fetchElementDetails(this.elementId);
    }
  }

  fetchElementDetails(id: number) {
    // Replace with API call
    this.apiService.get<Element>(`/elements/${id}`).subscribe((element) => {
      this.type = element.type === 'Produs' ? ElementType.Produs : ElementType.Serviciu;
      this.name = element.name;
      this.selectedCategoryName = element.categoryName;
      this.selectedCategoryId = element.categoryId;
      this.description = element.description || '';
      this.aquisitionPrice = element.aquisitionPrice || 0;
      this.sellingPrice = element.sellingPrice || 0;
      this.selectedTaxId = element.taxId;
      this.selectedTaxValue = element.taxValue;
    });
  }

  onTaxRemoved(tax: Tax) {
    const taxes = this.taxesControl.value as Tax[];
    this.removeFirst(taxes, tax);
    this.taxesControl.setValue(taxes); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  toggleAcquireInfo() {
    if (!this.acquireInfo) {
      this.sellingInfo = true;
    }
  }

  toggleSellingInfo() {
    if (!this.sellingInfo) {
      this.acquireInfo = true;
    }
  }

  onTaxSelected(taxId: number) {
    const selectedTax = this.taxes.find(tax => tax.id === taxId);
    if (selectedTax) {
      this.selectedTaxId = selectedTax.id!;
      this.selectedTaxValue = selectedTax.value!;
    }
  }

  onCategorySelected(categoryId: number) {
    const selectedCategory = this.categories.find(category => category.id === categoryId);
    if (selectedCategory) {
      this.selectedCategoryId = selectedCategory.id!;
      this.selectedCategoryName = selectedCategory.name!;
    }
  }

  selectElementType(type: ElementType) {
    this.type = type;
  }

  saveElement() {
    const element: Element = {
      id: this.elementId,
      type: this.type === ElementType.Produs ? 'Produs' : 'Serviciu',
      name: this.name,
      categoryName: this.selectedCategoryName,
      categoryId: this.selectedCategoryId,
      description: this.description,
      aquisitionPrice: this.acquireInfo ? this.aquisitionPrice : undefined,
      sellingPrice: this.sellingInfo ? this.sellingPrice : undefined,
      taxId: this.selectedTaxId,
      taxValue: this.selectedTaxValue
    };

    if (this.isEditMode) {
      this.apiService.put(`/elements`, element).subscribe(() => {
        this.router.navigate(['/elements']);
      });
    } else {
      this.apiService.post('/elements', element).subscribe(() => {
        this.router.navigate(['/elements']);
      });
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
