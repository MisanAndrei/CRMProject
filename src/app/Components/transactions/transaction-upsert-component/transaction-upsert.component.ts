import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      methodOfPayment: ['', Validators.required],
      account: ['', Validators.required],
      sum: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      invoice: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.transactionForm.valid) {
      console.log(this.transactionForm.value);
      // Handle form submission logic here, such as saving transaction data to a server
    } else {
      console.log('Form is invalid');
    }
  }
}