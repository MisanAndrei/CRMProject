import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

interface TaxOption {
  id: number;
  description: string;
  value: number;
}

interface Customer {
  id: number;
  name: string;
  cui: string;
  city: string;
}

@Component({
  selector: 'app-bill-upsert',
  templateUrl: './bill-upsert.component.html',
  styleUrls: ['./bill-upsert.component.css']
})
export class BillUpsertComponent implements OnInit {
  transactionForm: FormGroup;
  taxOptions: TaxOption[] = [
    { id: 1, description: 'No Tax', value: 0 },
    { id: 2, description: 'VAT 5%', value: 5 },
    { id: 3, description: 'VAT 10%', value: 10 },
    { id: 4, description: 'Sales Tax 8%', value: 8 }
  ];
  customers: Customer[] = [
    { id: 1, name: 'Customer A', cui: 'CUI12345', city: 'City A' },
    { id: 2, name: 'Customer B', cui: 'CUI67890', city: 'City B' }
  ];

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      transactionType: ['purchase', Validators.required],
      customer: [''],
      customerName: [{ value: '', disabled: false }, Validators.required],
      customerCui: [{ value: '', disabled: false }, Validators.required],
      customerCity: [{ value: '', disabled: false }, Validators.required],
      date: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addItem();
  }

  get items(): FormArray {
    return this.transactionForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      tax: [this.taxOptions[0].id, Validators.required] // Default to 'No Tax'
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onCustomerChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const customerId = Number(selectElement.value);
    const selectedCustomer = this.customers.find(c => c.id === customerId);

    if (selectedCustomer) {
      this.transactionForm.patchValue({
        customerName: selectedCustomer.name,
        customerCui: selectedCustomer.cui,
        customerCity: selectedCustomer.city
      });
      this.transactionForm.get('customerName')?.disable();
      this.transactionForm.get('customerCui')?.disable();
      this.transactionForm.get('customerCity')?.disable();
    } else {
      this.transactionForm.patchValue({
        customerName: '',
        customerCui: '',
        customerCity: ''
      });
      this.transactionForm.get('customerName')?.enable();
      this.transactionForm.get('customerCui')?.enable();
      this.transactionForm.get('customerCity')?.enable();
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      console.log(this.transactionForm.value);
      // Handle form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }

  isPurchase(): boolean {
    return this.transactionForm.get('transactionType')?.value === 'purchase';
  }
}