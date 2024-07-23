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
  accounts: Account[] = [];
  methodsOfPayment: MethodOfPayment[] = [
    { id: 1, name: 'Card de credit' },
    { id: 2, name: 'Transfer Bancar' },
    { id: 3, name: 'Cash' }
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
      fromBankAccountId: [0, Validators.required],
      fromBankAccountName: ['Nume Banca'],
      toBankAccountId: [0, Validators.required],
      toBankAccountName: ['Nume Banca'],
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

    this.fetchAccounts();
  }

  fetchTransferDetails(id: number): void {
    this.apiService
      .get<Transfer>(`financial/account/transfer/${id}`)
      .subscribe((transfer) => {
        this.transferForm.patchValue({
          fromBankAccount: transfer.fromBankAccountId,
          fromBankAccountId: transfer.fromBankAccountId,
          fromBankAccountName: transfer.fromBankAccountName,
          toBankAccount: transfer.toBankAccountId,
          toBankAccountId: transfer.toBankAccountId,
          toBankAccountName: transfer.toBankAccountName,
          date: new Date(transfer.date).toISOString().split('T')[0],
          amount: transfer.amount,
          description: transfer.description,
          paymentMethod: transfer.paymentMethod,
          reference: transfer.reference,
        });
      });
  }

  onAccountChange(accountType: 'from' | 'to', accountId: number): void {
    const selectedAccount = this.accounts.find(
      (account) => account.id === accountId
    );
    if (selectedAccount) {
      if (accountType === 'from') {
        this.transferForm.patchValue({
          fromBankAccountId: selectedAccount.id,
          fromBankAccountName: selectedAccount.name,
        });
      } else {
        this.transferForm.patchValue({
          toBankAccountId: selectedAccount.id,
          toBankAccountName: selectedAccount.name,
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
        fromBankAccountId: Number(
          this.transferForm.get('fromBankAccountId')?.value
        ),
        fromBankAccountName: this.accounts.filter(
          (x) =>
            x.id === Number(this.transferForm.get('fromBankAccountId')?.value)
        )[0].name,
        toBankAccountId: Number(
          this.transferForm.get('toBankAccountId')?.value
        ),
        toBankAccountName: this.accounts.filter(
          (x) =>
            x.id === Number(this.transferForm.get('toBankAccountId')?.value)
        )[0].name,
        description: this.transferForm.get('description')?.value,
        paymentMethod: this.transferForm.get('paymentMethod')?.value,
        reference: this.transferForm.get('reference')?.value,
      };

      if (this.isEditMode) {
        transferData.id = this.transferId;
        this.apiService
          .put(`financial/account/transfer/`, transferData)
          .subscribe({
            next: () => {
              console.log('Transfer updated successfully');
              this.router.navigate(['/Transferuri']);
            },
            error: (error) => {
              console.error('Error updating transfer', error);
            },
          });
      } else {
        this.apiService
          .post('financial/account/transfer/', transferData)
          .subscribe({
            next: () => {
              console.log('Transfer created successfully');
              this.router.navigate(['/Transferuri']);
            },
            error: (error) => {
              console.error('Error creating transfer', error);
            },
          });
      }
    } else {
      this.transferForm.markAllAsTouched();
    }
  }

  fetchAccounts() {
    this.apiService.get<Account[]>('financial/account/').subscribe({
      next: (data: Account[]) => {
        this.accounts = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      },
      complete: () => {
        console.info('categories data fetch complete');
      },
    });
  }
}
