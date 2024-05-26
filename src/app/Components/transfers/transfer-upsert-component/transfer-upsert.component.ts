import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.transferForm = this.fb.group({
      payableAccount: ['', Validators.required],
      beneficiarAccount: ['', Validators.required],
      dateOfTransaction: ['', Validators.required],
      sum: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      reference: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.transferForm.valid) {
      console.log(this.transferForm.value);
      // Handle form submission logic here
    } else {
      console.log('Form is invalid');
    }
  }
}