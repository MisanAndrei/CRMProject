import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/ApiService'; // Update the path as necessary
import { Transfer } from '../../../Utilities/Models';

interface Account {
  id: number;
  name: string;
}

interface MethodOfPayment {
  id: number;
  name: string;
}

@Component({
  selector: 'app-transfer-upsert',
  templateUrl: './transfer-upsert.component.html',
  styleUrls: ['./transfer-upsert.component.css']
})
export class TransferUpsertComponent implements OnInit {
  transferForm: FormGroup;
  accounts: Account[] = [
    { id: 1, name: 'Account A' },
    { id: 2, name: 'Account B' },
    { id: 3, name: 'Account C' }
  ];
  methodsOfPayment: MethodOfPayment[] = [
    { id: 1, name: 'Method A' },
    { id: 2, name: 'Method B' },
    { id: 3, name: 'Method C' }
  ];
  transferId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.transferForm = this.fb.group({
      fromBankAccount: ['', Validators.required],
      fromBankAccountId: [0, Validators.required],
      fromBankAccountName: [''],
      toBankAccount: ['', Validators.required],
      toBankAccountId: [0, Validators.required],
      toBankAccountName: [''],
      date: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      description: '',
      paymentMethod: ['', Validators.required],
      reference: ''
    });
  }

  ngOnInit(): void {
    this.transferId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.transferId;

    if (this.isEditMode) {
      this.fetchTransferDetails(this.transferId);
    }
  }

  fetchTransferDetails(id: number): void {
    this.apiService.get<Transfer>(`/transfers/${id}`).subscribe((transfer) => {
      this.transferForm.patchValue({
        fromBankAccount: transfer.fromBankAccountId,
        fromBankAccountId: transfer.fromBankAccountId,
        fromBankAccountName: transfer.fromBankAccountName,
        toBankAccount: transfer.toBankAccountId,
        toBankAccountId: transfer.toBankAccountId,
        toBankAccountName: transfer.toBankAccountName,
        date: transfer.date.toISOString().split('T')[0],
        amount: transfer.amount,
        description: transfer.description,
        paymentMethod: transfer.paymentMethod,
        reference: transfer.reference
      });
    });
  }

  onAccountChange(accountType: 'from' | 'to', accountId: number): void {
    const selectedAccount = this.accounts.find(account => account.id === accountId);
    if (selectedAccount) {
      if (accountType === 'from') {
        this.transferForm.patchValue({
          fromBankAccountId: selectedAccount.id,
          fromBankAccountName: selectedAccount.name
        });
      } else {
        this.transferForm.patchValue({
          toBankAccountId: selectedAccount.id,
          toBankAccountName: selectedAccount.name
        });
      }
    }
  }

  onSubmit(): void {
    if (this.transferForm.valid) {
      const transferData: Transfer = {
        id: this.transferId,
        date: new Date(this.transferForm.get('date')?.value),
        amount: this.transferForm.get('amount')?.value,
        fromBankAccountId: this.transferForm.get('fromBankAccountId')?.value,
        fromBankAccountName: this.transferForm.get('fromBankAccountName')?.value,
        toBankAccountId: this.transferForm.get('toBankAccountId')?.value,
        toBankAccountName: this.transferForm.get('toBankAccountName')?.value,
        description: this.transferForm.get('description')?.value,
        paymentMethod: this.transferForm.get('paymentMethod')?.value,
        reference: this.transferForm.get('reference')?.value
      };

      if (this.isEditMode) {
        this.apiService.put(`/transfers/${this.transferId}`, transferData).subscribe(() => {
          this.router.navigate(['/transfers']);
        });
      } else {
        this.apiService.post('/transfers', transferData).subscribe(() => {
          this.router.navigate(['/transfers']);
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }
}