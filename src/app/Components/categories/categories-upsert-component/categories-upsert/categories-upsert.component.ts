import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Type {
  id: number;
  name: string;
}

 @Component({
  selector: 'app-categories-upsert',
  templateUrl: './categories-upsert.component.html',
  styleUrl: './categories-upsert.component.css'
})
export class CategoriesUpsertComponent implements OnInit {
  typeForm: FormGroup;
  selectedColor: string = '#9dcd8a';

  types: Type[] = [
        { id: 1, name: 'Alta' },
        { id: 2, name: 'Cheltuiala' },
        { id: 3, name: 'Element' },
        { id: 4, name: 'Venit' }
      ];
  
  @ViewChild('colorInput') colorInput!: ElementRef<HTMLInputElement>;

   constructor(private fb: FormBuilder) {
    this.typeForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      selectedColor: [this.selectedColor]
    });
  }

  ngOnInit(): void {
    this.typeForm.get('selectedColor')!.valueChanges.subscribe((value:string) => {
      this.selectedColor = value;
    })
  }

openColorPicker(): void {
  this.colorInput.nativeElement.click();
}


     onSubmit(): void {
     if (this.typeForm.valid) {
       console.log(this.typeForm.value);
     } else {
       console.log('Form is invalid');
     }
   }
  }
