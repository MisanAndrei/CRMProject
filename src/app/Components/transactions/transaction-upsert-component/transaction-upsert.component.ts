import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account, Category, Invoice, Transaction } from '../../../Utilities/Models';
import { ApiService } from '../../../Services/ApiService';
import { InvoiceDirection, TransactionDirection } from '../../../Utilities/Enums';


interface PaymentMethod {
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
  accounts: Account[] = [];
  invoices: Invoice[] = [];

  allAccounts: Account[] = [];
  allInvoices: Invoice[] = [];
  allCategories: Category[] = [];

  transactionDirections = [
    { id: 'INCOME', name: 'Incasare' },
    { id: 'EXPENSE', name: 'Plata' }
  ];

  categories: Category[] = [];
  transactionId: number | null = null;

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService, private route: ActivatedRoute,) { // Inject your API service
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      methodOfPayment: ['', Validators.required],
      account: ['', Validators.required],
      sum: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      invoiceId: [null],
      reference: [''],
      direction: ['', Validators.required],
      category: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.transactionId = Number(params.get('id'));
      if (this.transactionId) {
        this.loadTransaction(this.transactionId);
      }
    });
    this.fetchAccounts();
    this.fetchInvoices();
    this.fetchCategories();

    this.transactionForm.get('direction')?.valueChanges.subscribe(value => {
      this.onDirectionChange(value);
    });

    this.transactionForm.get('invoiceId')?.valueChanges.subscribe(value => {
      this.onInvoiceChange(value);
    });
   }

   onDirectionChange(value: string): void {
    if (value == 'INCOME'){
      this.categories = this.allCategories.filter(x => x.type == 'Venit');
      this.invoices = this.allInvoices.filter(x => x.direction == InvoiceDirection.out);
    } else {
      this.categories = this.allCategories.filter(x => x.type !== 'Venit');
      this.invoices = this.allInvoices.filter(x => x.direction == InvoiceDirection.in);
    }

  }

  onInvoiceChange(value: number): void {
    const invoice = this.allInvoices.find(x => x.id == value);

    if (invoice?.direction == InvoiceDirection.in){
      this.categories = this.allCategories.filter(x => x.type !== 'Venit');
    } else {
      this.categories = this.allCategories.filter(x => x.type == 'Venit');
    }

      const direction = this.transactionDirections.find(x => x.id == (invoice?.direction == InvoiceDirection.in ? 'EXPENSE' : 'INCOME'))
    this.transactionForm.patchValue({
      category: invoice?.categoryId,
      direction: direction?.id,
    });

  }

   loadTransaction(id: number): void {
    this.apiService.get<Transaction>(`financial/invoice/payments/${id}`).subscribe({
      next: (transaction) => {
        this.transactionForm.patchValue({
          date: transaction.paymentDate,
          methodOfPayment: transaction.paymentMethod,
          account: transaction.bankAccountId,
          sum: transaction.amount,
          description: transaction.description,
          invoiceId: transaction.invoiceId,
          reference: transaction.reference,
          direction: transaction.paymentDirection === TransactionDirection.in ? 'INCOME' : 'EXPENSE',
          category: transaction.categoryId
        });
      },
      error: (error) => {
        console.error('Error loading transaction', error);
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const selectedCategory = this.categories.find(x => x.id?.toString() === formValue.category);

      const transaction: Transaction = {
        paymentDate: formValue.date,
        invoiceId: Number(formValue.invoiceId),
        reference: formValue.reference,
        amount: formValue.sum,
        paymentDirection: formValue.direction === 'INCOME' ? TransactionDirection.in : TransactionDirection.out,
        bankAccountId: Number(formValue.account),
        paymentMethod: formValue.methodOfPayment,
        description: formValue.description,
        categoryId: formValue.category,
        categoryName: this.allCategories.find(x => x.id == formValue.category)?.name
      };

      if (transaction.id) {
        this.apiService.put('financial/invoice/payments', transaction).subscribe({
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
        this.apiService.post('financial/invoice/payments', transaction).subscribe({
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
      this.transactionForm.markAllAsTouched();
    }
  }

  fetchAccounts() {
    this.apiService.get<Account[]>('financial/account/').subscribe({
      next: (data: Account[]) => {
        this.allAccounts = data;
        this.accounts = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching accounts', error);
      },
      complete: () => {
        console.info('Accounts data fetch complete');
      }
    });
  }

  fetchInvoices() {
    this.apiService.get<Invoice[]>('financial/invoice/').subscribe({
      next: (data: Invoice[]) => {
        this.invoices = data;
        this.allInvoices = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching invoices', error);
      },
      complete: () => {
        console.info('Invoices data fetch complete');
      }
    });
  }

  fetchCategories(){
    this.apiService.get<Category[]>('financial/category/').subscribe({
      next: (data: Category[]) => {
        this.allCategories = data.filter(x => x.type !== 'Element');
        this.categories = data.filter(x => x.type !== 'Element');
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching categoryes', error);
      },
      complete: () => {
        console.info('Categories data fetch complete');
      }
    });
  }
}