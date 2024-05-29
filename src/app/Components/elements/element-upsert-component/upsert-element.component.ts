import { Component } from '@angular/core';
import { ElementType } from '../../../Utilities/Enums';
import { Tax } from '../../../Utilities/Models';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-upsert-element',
  templateUrl: './upsert-element.component.html',
  styleUrls: ['./upsert-element.component.css'],
})
export class UpsertElementComponent {
  elementType: ElementType = ElementType.Produs; // Default to Product
  nume: string = '';
  categorie: string = '';
  descriere: string = '';

  acquireInfo: boolean = true;
  sellingInfo: boolean = false;
  acquireInfoValue: string = '';
  sellingInfoValue: string = '';

  taxes: Tax[] = [
    { id: 1, name: 'Tax 1' },
    { id: 2, name: 'Tax 2' },
  ];

  selectedTax: Tax | undefined;

  taxesControl = new FormControl<Tax[]>([]);

  onTaxRemoved(tax: Tax) {
    const taxes = this.taxesControl.value as Tax[];
    this.removeFirst(taxes, tax);
    this.taxesControl.setValue(taxes); // To trigger change detection
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  toggleAcquireInfo() {
    if (!this.acquireInfo) {
      this.sellingInfo = true;
    }
  }

  toggleSellingInfo() {
    if (!this.sellingInfo) {
      this.acquireInfo = true;
    }
  }

  selectElementType(type: ElementType) {
    this.elementType = type;
  }

  saveElement() {
    //aici o sa salvam si creem obiectul de save
  }
}
