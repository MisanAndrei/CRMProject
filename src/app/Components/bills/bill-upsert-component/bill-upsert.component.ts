import { Component, OnInit } from '@angular/core';
import { Element } from '../../../Utilities/Models';

@Component({
  selector: 'app-bill-upsert',
  templateUrl: './bill-upsert.component.html',
  styleUrls: ['./bill-upsert.component.css']
})
export class BillUpsertComponent implements OnInit {

  companyTitle: string = '';
  companySubtitle: string = '';
  companyInfo: any = {
    address: 'Company Address',
    phone: 'Company Phone',
    email: 'company@example.com',
    website: 'www.company.com'
  };
  selectedElements: Element[] = [];
  elements!: Element[];
  selectedElement: any = null;
  isDropdownOpen: boolean = false;

  facturaData: string = '';
  scadentaData: string = '';
  numarFactura: string = '';
  numarComanda: string = '';

  taxes: any[] = [
    { id: 1, description: 'Tax 1' },
    { id: 2, description: 'Tax 2' },
    // Add more taxes as needed
  ];

  selectedTaxId: number | null = null;

  constructor() { }

  ngOnInit(): void {
    this.elements = this.getElements();
  }

  getElements() {
    const elements: Element[] = [
      { id: 1, nume: 'Element 1', categorie: 'Category 1', culoare: 'Red', taxe: 'TVA', pretAchizitie: 10, pretVanzare: 20 },
      { id: 2, nume: 'Element 2', categorie: 'Category 2', culoare: 'Blue', taxe: 'TVA', pretAchizitie: 15, pretVanzare: 25 },
      // Add more elements as needed
    ];
    return elements;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectElement(element: Element) {
    this.selectedElement = element;
    this.selectedTaxId = null; // Reset selected tax
  }

  addNewElement(){

  }
}