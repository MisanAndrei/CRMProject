import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-bill-preferences',
  templateUrl: './bill-preferences.component.html',
  styleUrls: ['./bill-preferences.component.css']
})
export class BillPreferencesComponent implements OnInit {
  preferencesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.preferencesForm = this.fb.group({
      prefix: ['', Validators.required],
      nextNumber: [1, [Validators.required, Validators.min(1)]],
      title: ['', Validators.required],
      note: [''],
      subantet: [''],
      subsol: ['']
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    
  }

  onSubmit(): void {
    if (this.preferencesForm.valid) {
      console.log(this.preferencesForm.value);
      // Handle form submission logic here, such as saving preferences to a server
    } else {
      console.log('Form is invalid');
    }
  }
}