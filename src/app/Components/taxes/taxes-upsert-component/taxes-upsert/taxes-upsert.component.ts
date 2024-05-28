import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Type {
  id: number;
  name: string;
}

@Component({
  selector: 'app-taxes-upsert',
  templateUrl: './taxes-upsert.component.html',
  styleUrl: './taxes-upsert.component.css'
 })

 export class TaxesUpsertComponent implements OnInit {
  typeForm: FormGroup;
 
  types: Type[] = [
    { id: 1, name: 'Corectat' },
    { id: 2, name: 'Inclusiv' },
    { id: 3, name: 'Normal' },
    { id: 4, name: 'Taxă compusă' },
    { id: 5, name: 'Taxă salarială' }
  ];

  constructor(private fb: FormBuilder) {
    this.typeForm = this.fb.group({
      name: ['', Validators.required],
      tax: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  ngOnInit(): void {} 

onSubmit(): void {
  if (this.typeForm.valid) {
    console.log(this.typeForm.value);
    // Handle form submission logic here
  } else {
    console.log('Form is invalid');
  }
}

}

