import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-upsert',
  templateUrl: './account-upsert.component.html',
  styleUrls: ['./account-upsert.component.css']
})
export class AccountUpsertComponent implements OnInit {
  accountForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      currency: [{ value: 'RON', disabled: true }, Validators.required],
      initialSold: [0, [Validators.required, Validators.min(0)]],
      nameOfTheBank: ['', Validators.required],
      phoneOfTheBank: ['', Validators.required],
      addressOfTheBank: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.accountForm.valid) {
      console.log(this.accountForm.value);
      // Handle form submission logic here, such as saving account data to a server
    } else {
      console.log('Form is invalid');
    }
  }
}