import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bill-preferences',
  templateUrl: './bill-preferences.component.html',
  styleUrls: ['./bill-preferences.component.css']
})
export class BillPreferencesComponent implements OnInit {
  preferencesForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.preferencesForm = this.fb.group({
      prefix: ['', Validators.required],
      nextNumber: [1, [Validators.required, Validators.min(1)]],
      numberOfDecimals: [2, [Validators.required, Validators.min(0)]],
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
    this.http.get<any>('https://your-api-endpoint.com/preferences')
      .subscribe(data => {
        this.preferencesForm.patchValue({
          prefix: data.prefix,
          nextNumber: data.nextNumber,
          numberOfDecimals: data.numberOfDecimals,
          title: data.title,
          note: data.note,
          subantet: data.subantet,
          subsol: data.subsol
        });
      });
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