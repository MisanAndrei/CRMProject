import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../Services/ApiService'; // Update the path as necessary
import { Account } from '../../../Utilities/Models'; // Update the path as necessary

@Component({
  selector: 'app-account-upsert',
  templateUrl: './account-upsert.component.html',
  styleUrls: ['./account-upsert.component.css']
})
export class AccountUpsertComponent implements OnInit {
  accountForm: FormGroup;
  accountId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      currency: [{ value: 'RON', disabled: true }, Validators.required],
      initialSold: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.accountId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.accountId;

    if (this.isEditMode) {
      this.fetchAccountDetails(this.accountId);
    }
  }

  fetchAccountDetails(id: number): void {
    this.apiService.get<Account>(`/accounts/${id}`).subscribe((account) => {
      this.accountForm.patchValue({
        name: account.name,
        number: account.accountNumber
      });
    });
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const accountData: Account = {
        id: this.accountId,
        name: this.accountForm.get('name')?.value,
        accountNumber: this.accountForm.get('number')?.value,
        sold: this.accountForm.get('initialSold')?.value
      };

      if (this.isEditMode) {
        this.apiService.put(`financial/bank-account`, accountData).subscribe(() => {
          this.router.navigate(['/accounts']);
        });
      } else {
        this.apiService.post('financial/bank-account', accountData).subscribe(() => {
          this.router.navigate(['/accounts']);
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }
}