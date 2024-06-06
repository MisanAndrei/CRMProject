import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface TaxOption {
  id: number;
  description: string;
  value: number;
}

interface Partner {
  id: number;
  name: string;
  cui: string;
  city: string;
}

interface Item {
  id: number;
  name: string;
  price: number;
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
  partners: Partner[] = [
    { id: 1, name: 'Partner A', cui: 'CUI12345', city: 'City A' },
    { id: 2, name: 'Partner B', cui: 'CUI67890', city: 'City B' }
  ];
  predefinedItems: Item[] = [
    { id: 1, name: 'Item A', price: 100 },
    { id: 2, name: 'Item B', price: 200 },
    { id: 3, name: 'Item C', price: 300 }
  ];
  overallTotal: number = 0;

  constructor(private fb: FormBuilder, private router: Router) {
    this.transactionForm = this.fb.group({
      transactionType: ['purchase', Validators.required],
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
  }

  get items(): FormArray {
    return this.transactionForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.fb.group({
      selectedItem: [''],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      tax: [this.taxOptions[0].id, Validators.required], // Default to 'No Tax'
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
        customerName: '',
        customerCui: '',
        customerCity: ''
      });
      this.transactionForm.get('partnerName')?.enable();
      this.transactionForm.get('customerCui')?.enable();
      this.transactionForm.get('customerCity')?.enable();
    }
  }

  onItemChange(index: number): void {
    const selectedItemControl = this.items.at(index).get('selectedItem');
    const priceControl = this.items.at(index).get('price');
    const descriptionControl = this.items.at(index).get('description');
    const selectedItemId = Number(selectedItemControl?.value);
    const selectedItem = this.predefinedItems.find(item => item.id === selectedItemId);

    if (selectedItem) {
      priceControl?.setValue(selectedItem.price);
      descriptionControl?.setValue(selectedItem.name);
    } else {
      priceControl?.setValue(0);
      descriptionControl?.setValue('');
    }

    this.updateTotal(index);
  }

  updateTotal(index: number): void {
    const quantityControl = this.items.at(index).get('quantity');
    const priceControl = this.items.at(index).get('price');
    const taxControl = this.items.at(index).get('tax');
    const totalControl = this.items.at(index).get('total');

    const quantity = quantityControl?.value || 0;
    const price = priceControl?.value || 0;
    const tax = this.taxOptions.find(t => t.id === Number(taxControl?.value))?.value || 0;

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
      console.log(this.transactionForm.value);
      // Handle form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }
  addPartner() {
    // Navigate to the page for adding a new bill
    this.router.navigate(['/Test']);
  }

  isPurchase(): boolean {
    return this.transactionForm.get('transactionType')?.value === 'purchase';
  }
}