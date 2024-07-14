import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../Services/ApiService'; // Update the path as necessary
import { Category } from '../../../../Utilities/Models';

interface Type {
  id: number;
  name: string;
}


@Component({
  selector: 'app-categories-upsert',
  templateUrl: './categories-upsert.component.html',
  styleUrls: ['./categories-upsert.component.css']
})
export class CategoriesUpsertComponent implements OnInit {
  typeForm: FormGroup;
  selectedColor: string = '#7abf95';
  types: Type[] = [
    { id: 1, name: 'Alta' },
    { id: 2, name: 'Cheltuiala' },
    { id: 3, name: 'Element' },
    { id: 4, name: 'Venit' }
  ];
  categoryId?: number;
  isEditMode = false;

  @ViewChild('colorInput') colorInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.typeForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      selectedColor: [this.selectedColor, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    this.isEditMode = !!this.categoryId;

    if (this.isEditMode) {
      this.fetchCategoryDetails(this.categoryId);
    }

    this.typeForm.get('selectedColor')!.valueChanges.subscribe((value: string) => {
      this.selectedColor = value;
    });
  }

  fetchCategoryDetails(id: number): void {
    this.apiService.get<Category>(`/categories/${id}`).subscribe((category) => {
      this.typeForm.patchValue({
        name: category.name,
        type: category.type,
        selectedColor: category.colorCode
      });
      this.selectedColor = category.colorCode;
    });
  }

  openColorPicker(): void {
    this.colorInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.typeForm.valid) {
      const categoryData: Category = {
        id: this.categoryId,
        name: this.typeForm.get('name')?.value,
        type: this.typeForm.get('type')?.value,
        colorCode: this.typeForm.get('selectedColor')?.value
      };

      if (this.isEditMode) {
        this.apiService.put(`financial/category/${this.categoryId}`, categoryData).subscribe(() => {
          this.router.navigate(['/Categorii']);
        });
      } else {
        if (categoryData.id == 0)
          categoryData.id = undefined;
        this.apiService.post('financial/category/', categoryData).subscribe(() => {
          this.router.navigate(['/Categorii']);
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }
}