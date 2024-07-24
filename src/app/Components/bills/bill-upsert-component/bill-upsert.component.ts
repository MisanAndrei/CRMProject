import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PartnerUpsertComponent } from '../../partners/partner-upsert-component/partner-upsert.component';
import { ApiService } from '../../../Services/ApiService';
import { Category, Partner, Tax, Element, InvoiceElement, Invoice, InvoicePreferences } from '../../../Utilities/Models';
import { InvoiceDirection } from '../../../Utilities/Enums';

@Component({
  selector: 'app-bill-upsert',
  templateUrl: './bill-upsert.component.html',
  styleUrls: ['./bill-upsert.component.css']
})
export class BillUpsertComponent implements OnInit {
  transactionForm: FormGroup;
  billNumber: string = '';
  billPrefix: string = '';

  taxOptions: Tax[] = [
    { id: 1, name: 'No Tax', value: 0 },
    { id: 2, name: 'VAT 5%', value: 5 },
    { id: 3, name: 'VAT 10%', value: 10 },
    { id: 4, name: 'Sales Tax 8%', value: 8 }
  ];
  partners: Partner[] = [];
  categories: Category[] = [];
  allCategories: Category[]=[];
  elements: Element[] = [];
  overallTotal: number = 0;

  constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog, private apiService: ApiService) {
    this.transactionForm = this.fb.group({
      transactionType: ['purchase', Validators.required],
      category: ['', Validators.required],
      dateOfBill: ['', Validators.required],
      dueDate: ['', Validators.required],
      numberOfBill: [{ value: '', disabled: false }, Validators.required],
      orderNumber: [''],
      partner: [''],
      partnerName: [{ value: '', disabled: false }, Validators.required],
      customerCui: [{ value: '', disabled: false }, Validators.required],
      customerRegCom: [{ value: '', disabled: false }, Validators.required],
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
    this.fetchInvoiceNumber();
    this.fetchInvoicePrefix();

    this.transactionForm.get('transactionType')?.valueChanges.subscribe(value => {
      this.onTransactionTypeChange(value);
    });
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
        customerRegCom: selectedPartner.regCom,
        customerCity: selectedPartner.city
      });
      this.transactionForm.get('partnerName')?.disable();
      this.transactionForm.get('customerCui')?.disable();
      this.transactionForm.get('customerRegCom')?.disable();
      this.transactionForm.get('customerCity')?.disable();
    } else {
      this.transactionForm.patchValue({
        partnerName: '',
        customerCui: '',
        customerRegCom: '',
        customerCity: ''
      });
      this.transactionForm.get('partnerName')?.enable();
      this.transactionForm.get('customerCui')?.enable();
      this.transactionForm.get('customerRegCom')?.enable();
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
          this.router.navigate(['/Facturi'])
          // Navigate to another page or show a success message
        },
        error: (error) => {
          console.error('Error creating invoice', error);
        }
      });
    } else {
      this.transactionForm.markAllAsTouched();
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
    this.apiService.get<Category[]>('financial/category/').subscribe({
      next: (data: Category[]) => {
        this.allCategories = data;
        this.categories = this.allCategories.filter(x => x.type == 'Cheltuiala');
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      }
    });
  }

  fetchElements(): void {
    this.apiService.get<Element[]>('financial/element/').subscribe({
      next: (data: Element[]) => {
        this.elements = data;
      },
      error: (error) => {
        console.error('Error fetching elements', error);
      }
    });
  }

  fetchInvoiceNumber(): void {
    this.apiService.get<number>('financial/invoice/next-number').subscribe({
      next: (data: number) => {
          this.billNumber = data.toString();
      },
      error: (error) => {
        console.error('Error fetching invoice number', error);
      }
    });
  }

  fetchInvoicePrefix():void {
    this.apiService.get<InvoicePreferences>('organization/invoice-preferences').subscribe({
      next: (data: InvoicePreferences) => {
        this.billPrefix = data.prefix;
      },
      error: (error) => {
        console.error('Error fetching preferences', error);
      }
    });
  }

  onTransactionTypeChange(value: string){
    const numberOfBillControl = this.transactionForm.get('numberOfBill');
    if (value === 'sale'){
      this.transactionForm.patchValue({
        numberOfBill: this.billPrefix + this.billNumber
      });
      this.categories = this.allCategories.filter(x => x.type == 'Venit');
      numberOfBillControl?.disable();
    } else {
      this.transactionForm.patchValue({
        numberOfBill: ''
      });
      this.categories = this.allCategories.filter(x => x.type == 'Cheltuiala');
      numberOfBillControl?.enable();
    }
    
  }
}