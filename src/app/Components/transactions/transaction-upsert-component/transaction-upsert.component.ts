import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category, Transaction } from '../../../Utilities/Models';
import { ApiService } from '../../../Services/ApiService';
import { TransactionDirection } from '../../../Utilities/Enums';


interface PaymentMethod {
  id: number;
  name: string;
}

interface Account {
  id: number;
  name: string;
}

interface Invoice {
  id: number;
  name: string;
}

@Component({
  selector: 'app-transaction-upsert',
  templateUrl: './transaction-upsert.component.html',
  styleUrls: ['./transaction-upsert.component.css']
})
export class TransactionUpsertComponent implements OnInit {
  transactionForm: FormGroup;
  paymentMethods: PaymentMethod[] = [
    { id: 1, name: 'Card de credit' },
    { id: 2, name: 'Transfer Bancar' },
    { id: 3, name: 'Cash' }
  ];
  accounts: Account[] = [
    { id: 1, name: 'Account A' },
    { id: 2, name: 'Account B' },
    { id: 3, name: 'Account C' }
  ];
  invoices: Invoice[] = [
    { id: 1, name: 'Invoice 001' },
    { id: 2, name: 'Invoice 002' },
    { id: 3, name: 'Invoice 003' }
  ];

  transactionDirections = [
    { id: 'INCOME', name: 'Incasare' },
    { id: 'EXPENSE', name: 'Plata' }
  ];

  categories: Category[] = [
    { id: 1, name: 'Categorie 1', type: 'Cheltuiala', colorCode: 'asdasd' },
    { id: 2, name: 'Categorie 2', type: 'Venit', colorCode: 'asdasd' }
  ];

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) { // Inject your API service
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      methodOfPayment: ['', Validators.required],
      account: ['', Validators.required],
      sum: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      invoice: ['', Validators.required],
      reference: [''],
      direction: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchAccounts();
    this.fetchInvoices();
   }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const selectedCategory = this.categories.find(category => category.id === formValue.category);

      const transaction: Transaction = {
        paymentDate: formValue.date,
        invoiceId: formValue.invoice,
        reference: formValue.reference,
        amount: formValue.sum,
        paymentDirection: formValue.direction === 'INCOME' ? TransactionDirection.in : TransactionDirection.out,
        bankAccountId: formValue.account,
        paymentMethod: formValue.methodOfPayment,
        description: formValue.description,
        categoryId: selectedCategory?.id,
        categoryName: selectedCategory?.name
      };

      if (transaction.id) {
        this.apiService.put('/transactions', transaction).subscribe({
          next: () => {
            console.log('Transaction updated successfully');
            this.router.navigate(['/Tranzactii']);
          },
          error: (error) => {
            console.error('Error updating transaction', error);
          },
          complete: () => {
            console.info('Transaction update complete');
          }
        });
      } else {
        this.apiService.post('financial/transaction', transaction).subscribe({
          next: () => {
            console.log('Transaction created successfully');
            this.router.navigate(['/Tranzactii']);
          },
          error: (error) => {
            console.error('Error creating transaction', error);
          },
          complete: () => {
            console.info('Transaction creation complete');
          }
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

  fetchAccounts() {
    this.apiService.get<Account[]>('financial/accounts').subscribe({
      next: (data: Account[]) => {
        this.accounts = data;
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

  fetchInvoices() {
    this.apiService.get<Invoice[]>('financial/invoice').subscribe({
      next: (data: Invoice[]) => {
        this.accounts = data;
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