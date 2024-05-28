import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Color {
  hex: string;
  name: string;
}

interface Type {
  id: number;
  name: string;
}
const COLORS: Color[] = [
  { hex: '#ff0000', name: 'Red' },
  { hex: '#FF33AF', name: 'Pink' },
  { hex: '#0000ff', name: 'Blue' },
  { hex: '#33FF4F', name: 'Green' },
  { hex: '#ffff00', name: 'Yellow' },
  { hex: '#000000', name: 'Black' },
];

 @Component({
  selector: 'app-categories-upsert',
  templateUrl: './categories-upsert.component.html',
  styleUrl: './categories-upsert.component.css'
})
export class CategoriesUpsertComponent implements OnInit {
  typeForm: FormGroup;
  selectedColor: Color = COLORS[0];
  colorOptions = COLORS;

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
    this.typeForm = this.fb.group({
      selectedColor: [this.selectedColor.hex]
    });

    this.typeForm.get('selectedColor')!.valueChanges.subscribe((value: string) => {
      this.selectedColor = this.getColorByHex(value);
    });
  }

  getColorByHex(hex: string): Color {
    return this.colorOptions.find(color => color.hex === hex) || this.colorOptions[0];
  }

  onColorChange(color: Color): void {
    this.selectedColor = color;
    this.typeForm.get('selectedColor')?.setValue(color.hex);
  }

  openColorPicker(): void {
    this.colorInput.nativeElement.click();
  }

     onSubmit(): void {
     if (this.typeForm.valid) {
       console.log(this.typeForm.value);
       // Handle form submission logic here
     } else {
       console.log('Form is invalid');
     }
   }
  }



