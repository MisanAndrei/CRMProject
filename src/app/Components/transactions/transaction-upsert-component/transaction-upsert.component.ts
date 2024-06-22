import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../../../Utilities/Models';

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
    { id: 1, name: 'Credit Card' },
    { id: 2, name: 'Bank Transfer' },
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

  categories: Category[] = [{id: 1, name: 'Categorie 1', type: 'Cheltuiala', colorCode: 'asdasd'}, {id: 2, name: 'Categorie 2', type: 'Venit', colorCode: 'asdasd'}];

  constructor(private fb: FormBuilder, private router: Router) {
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      methodOfPayment: ['', Validators.required],
      account: ['', Validators.required],
      sum: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      invoice: ['', Validators.required],
      reference: [''],
      direction: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transaction = {
        paymentDate: formValue.date,
        invoiceId: formValue.invoice,
        reference: formValue.reference,
        amount: formValue.sum,
        paymentDirection: formValue.direction === 'INCOME' ? 'In' : 'Out',
        bankAccountId: formValue.account,
        paymentMethod: formValue.methodOfPayment,
        description: formValue.description,
      };
      console.log(transaction);
      // Handle form submission logic here, such as saving transaction data to a server
    } else {
      console.log('Form is invalid');
    }
  }
}