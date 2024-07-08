import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartnerUpsertComponent } from '../../partners/partner-upsert-component/partner-upsert.component';
import { ApiService } from '../../../Services/ApiService';
import { Category, Partner, Tax, Element, InvoiceElement, Invoice } from '../../../Utilities/Models';
import { InvoiceDirection } from '../../../Utilities/Enums';

@Component({
  selector: 'app-bill-upsert',
  templateUrl: './bill-upsert.component.html',
  styleUrls: ['./bill-upsert.component.css']
})
export class BillUpsertComponent implements OnInit {
  transactionForm: FormGroup;
  taxOptions: Tax[] = [
    { id: 1, name: 'No Tax', value: 0 },
    { id: 2, name: 'VAT 5%', value: 5 },
    { id: 3, name: 'VAT 10%', value: 10 },
    { id: 4, name: 'Sales Tax 8%', value: 8 }
  ];
  partners: Partner[] = [
    { id: 1, name: 'Partner A', cui: 'CUI12345', city: 'City A', email: 'partnerA@test.com', country: 'Romania', address: 'Address A', postalCode: '12345' },
    { id: 2, name: 'Partner B', cui: 'CUI67890', city: 'City B', email: 'partnerB@test.com', country: 'Romania', address: 'Address B', postalCode: '67890' },
    { id: 3, name: 'Partner C', cui: 'CUI54321', city: 'City C', email: 'partnerC@test.com', country: 'Romania', address: 'Address C', postalCode: '54321' }
  ];
  categories: Category[] = [
    { id: 1, name: 'Category 1', type: 'Type A', colorCode: '#FF5733' },
    { id: 2, name: 'Category 2', type: 'Type B', colorCode: '#33FF57' },
    { id: 3, name: 'Category 3', type: 'Type C', colorCode: '#3357FF' }
  ];
  elements: Element[] = [
    { id: 1, type: 'product', name: 'Element A', categoryName: 'Category 1', categoryId: 1, description: 'Description A', acquisitionPrice: 100, sellingPrice: 150, taxValue: 5, taxId: 2 },
    { id: 2, type: 'service', name: 'Element B', categoryName: 'Category 2', categoryId: 2, description: 'Description B', acquisitionPrice: 200, sellingPrice: 250, taxValue: 10, taxId: 3 },
    { id: 3, type: 'product', name: 'Element C', categoryName: 'Category 3', categoryId: 3, description: 'Description C', acquisitionPrice: 300, sellingPrice: 350, taxValue: 8, taxId: 4 }
  ];
  overallTotal: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog, private apiService: ApiService) {
    this.transactionForm = this.fb.group({
      transactionType: ['purchase', Validators.required],
      category: ['', Validators.required],
      dateOfBill: ['', Validators.required],
      dueDate: ['', Validators.required],
      numberOfBill: ['', Validators.required],
      orderNumber: ['', Validators.required],
      partner: [''],
      partnerName: [{ value: '', disabled: false }, Validators.required],
      customerCui: [{ value: '', disabled: false }, Validators.required],
      customerCity: [{ value: '', disabled: false }, Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addItem();
    this.fetchCategories();
    this.fetchElements();
    this.fetchPartners();
    this.fetchTaxes();
  }

  get items(): FormArray {
    return this.transactionForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      selectedItem: [''],
      elementName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      elementPrice: [0, [Validators.required, Validators.min(0)]],
      elementTax: [0, Validators.required], // Default to 'No Tax'
      elementDescription: ['', Validators.required],
      total: [{ value: 0, disabled: true }]
    }));
    this.updateOverallTotal();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateOverallTotal();
  }

  onPartnerChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const partnerId = Number(selectElement.value);
    const selectedPartner = this.partners.find(c => c.id === partnerId);

    if (selectedPartner) {
      this.transactionForm.patchValue({
        partnerName: selectedPartner.name,
        customerCui: selectedPartner.cui,
        customerCity: selectedPartner.city
      });
      this.transactionForm.get('partnerName')?.disable();
      this.transactionForm.get('customerCui')?.disable();
      this.transactionForm.get('customerCity')?.disable();
    } else {
      this.transactionForm.patchValue({
        partnerName: '',
        customerCui: '',
        customerCity: ''
      });
      this.transactionForm.get('partnerName')?.enable();
      this.transactionForm.get('customerCui')?.enable();
      this.transactionForm.get('customerCity')?.enable();
    }
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = Number(selectElement.value);
    const selectedCategory = this.categories.find(c => c.id === categoryId);

    if (selectedCategory) {
      this.transactionForm.patchValue({
        category: selectedCategory.id
      });
    }
  }

  onItemChange(index: number): void {
    const selectedItemControl = this.items.at(index).get('selectedItem');
    const priceControl = this.items.at(index).get('elementPrice');
    const descriptionControl = this.items.at(index).get('elementDescription');
    const nameControl = this.items.at(index).get('elementName');
    const taxControl = this.items.at(index).get('elementTax');
    const selectedItemId = Number(selectedItemControl?.value);
    const selectedItem = this.elements.find(element => element.id === selectedItemId);

    if (selectedItem) {
      const transactionType = this.transactionForm.get('transactionType')?.value;
      const price = transactionType === 'purchase' ? selectedItem.acquisitionPrice : selectedItem.sellingPrice;

      priceControl?.setValue(price || 0);
      nameControl?.setValue(selectedItem.name);
      descriptionControl?.setValue(selectedItem.description || '');
      taxControl?.setValue(selectedItem.taxValue);
    } else {
      priceControl?.setValue(0);
      nameControl?.setValue('');
      descriptionControl?.setValue('');
      taxControl?.setValue(0);
    }

    this.updateTotal(index);
  }

  onTaxChange(index: number): void {
    this.updateTotal(index);
  }

  updateTotal(index: number): void {
    const quantityControl = this.items.at(index).get('quantity');
    const priceControl = this.items.at(index).get('elementPrice');
    const taxControl = this.items.at(index).get('elementTax');
    const totalControl = this.items.at(index).get('total');

    const quantity = quantityControl?.value || 0;
    const price = priceControl?.value || 0;
    const tax = taxControl?.value || 0;

    const total = (price * quantity) * (1 + tax / 100);
    totalControl?.setValue(total.toFixed(2));

    this.updateOverallTotal();
  }

  onQuantityOrPriceChange(index: number): void {
    this.updateTotal(index);
  }

  updateOverallTotal(): void {
    this.overallTotal = this.items.controls.reduce((acc, item) => {
      const totalControl = item.get('total');
      const total = totalControl?.value || 0;
      return acc + parseFloat(total);
    }, 0);
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const selectedCategoryId = this.transactionForm.get('category')?.value;
      const selectedCategory = this.categories.find(c => c.id === selectedCategoryId);

      const invoice: Invoice = {
        total: this.overallTotal,
        partnerId: this.transactionForm.get('partner')?.value,
        partnerName: this.transactionForm.get('partnerName')?.value,
        categoryId: selectedCategory?.id,
        categoryName: selectedCategory?.name,
        invoiceNumber: this.transactionForm.get('numberOfBill')?.value,
        orderNumber: this.transactionForm.get('orderNumber')?.value,
        direction: this.transactionForm.get('transactionType')?.value === 'purchase' ? InvoiceDirection.in : InvoiceDirection.out,
        invoiceDate: new Date(this.transactionForm.get('dateOfBill')?.value),
        dueDate: new Date(this.transactionForm.get('dueDate')?.value),
        elements: this.items.controls.map(item => ({
          elementId: item.get('selectedItem')?.value,
          elementName: item.get('elementName')?.value,
          elementPrice: item.get('elementPrice')?.value,
          elementDescription: item.get('elementDescription')?.value,
          elementTax: item.get('elementTax')?.value,
          quantity: item.get('quantity')?.value,
        }))
      };

      this.apiService.post<Invoice>('financial/invoice/', invoice).subscribe({
        next: () => {
          console.log('Invoice created successfully');
          // Navigate to another page or show a success message
        },
        error: (error) => {
          console.error('Error creating invoice', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  addPartner() {
    const dialogRef = this.dialog.open(PartnerUpsertComponent, {
      width: '80%',
      maxHeight: '80vh',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchPartners(); // Refresh the partners list
      }
    });
  }

  isPurchase(): boolean {
    return this.transactionForm.get('transactionType')?.value === 'purchase';
  }

  fetchPartners(): void {
    this.apiService.get<Partner[]>('partner/').subscribe({
      next: (data: Partner[]) => {
        this.partners = data;
      },
      error: (error) => {
        console.error('Error fetching partners', error);
      }
    });
  }

  fetchTaxes(): void {
    this.apiService.get<Tax[]>('financial/tax/').subscribe({
      next: (data: Tax[]) => {
        this.taxOptions = data;
      },
      error: (error) => {
        console.error('Error fetching partners', error);
      }
    });
  }

  fetchCategories(): void {
    this.apiService.get<Category[]>('category/').subscribe({
      next: (data: Category[]) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      }
    });
  }

  fetchElements(): void {
    this.apiService.get<Element[]>('element/').subscribe({
      next: (data: Element[]) => {
        this.elements = data;
      },
      error: (error) => {
        console.error('Error fetching elements', error);
      }
    });
  }
}