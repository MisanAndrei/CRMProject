import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Element } from '../../../Utilities/Models';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteElementsDialogComponent } from '../../dashboard-component/dialogs/delete-dialog-component/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'nume', 'categorie', 'taxe', 'pretAchizitie', 'pretVanzare'];
  dataSource: MatTableDataSource<Element>;
  searchControl: FormControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Element>(this.allowMultiSelect, this.initialSelection);
  

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog, private router: Router) {
    this.dataSource = new MatTableDataSource<Element>();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // Example data
    const ELEMENT_DATA: Element[] = [
      { id: 1, nume: 'Element 1', categorie: 'Category 1', culoare: 'Red', taxe: 'TVA', pretAchizitie: 10, pretVanzare: 20 },
      { id: 1, nume: 'Element 2', categorie: 'Category 2', culoare: 'Blue', taxe: 'TVA', pretAchizitie: 15, pretVanzare: 25 },
      { id: 1, nume: 'Element 1', categorie: 'Category 1', culoare: 'Red', taxe: 'TVA', pretAchizitie: 10, pretVanzare: 20 },
      { id: 1, nume: 'Element 2', categorie: 'Category 2', culoare: 'Blue', taxe: 'TVA', pretAchizitie: 15, pretVanzare: 25 },
      { id: 1, nume: 'Element 1', categorie: 'Category 1', culoare: 'Red', taxe: 'TVA', pretAchizitie: 10, pretVanzare: 20 },
      { id: 1, nume: 'Element 2', categorie: 'Category 2', culoare: 'Blue', taxe: 'TVA', pretAchizitie: 15, pretVanzare: 25 },
      { id: 1, nume: 'Element 1', categorie: 'Category 1', culoare: 'Red', taxe: 'TVA', pretAchizitie: 10, pretVanzare: 20 },
      { id: 1, nume: 'Element 2', categorie: 'Category 2', culoare: 'Blue', taxe: 'TVA', pretAchizitie: 15, pretVanzare: 25 },
      { id: 1, nume: 'Element 1', categorie: 'Category 1', culoare: 'Red', taxe: 'TVA', pretAchizitie: 10, pretVanzare: 20 },
      { id: 1, nume: 'Element 2', categorie: 'Category 2', culoare: 'Blue', taxe: 'TVA', pretAchizitie: 15, pretVanzare: 25 },
      { id: 1, nume: 'Element 1', categorie: 'Category 1', culoare: 'Red', taxe: 'TVA', pretAchizitie: 10, pretVanzare: 20 },
      { id: 1, nume: 'Element 2', categorie: 'Category 2', culoare: 'Blue', taxe: 'TVA', pretAchizitie: 15, pretVanzare: 25 },
      // Add more data as needed
    ];

    this.dataSource.data = ELEMENT_DATA;


    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilter();
    });
  }

  applyFilter() {
    const filterValue = this.searchControl.value?.trim().toLowerCase() || '';
    this.dataSource.filter = filterValue;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }
  
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  
  isSingleSelection(): boolean {
    return this.selection.selected.length === 1;
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteElementsDialogComponent, {
      data: { title: 'Confirma stergerea', message: 'Esti sigur ca vrei sa stergi aceste categorii?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(element => element.id);
        
        // Call your function to delete elements using selectedIds
      }
      this.selection.clear();
    });
  }

  addElement() {
    this.router.navigate(['/AdaugaElement']);
  }
}