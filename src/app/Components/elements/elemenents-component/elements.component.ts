import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Element } from '../../../Utilities/Models';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog-component/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../../Services/ApiService';

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

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog, private router: Router, private apiService: ApiService) {
    this.dataSource = new MatTableDataSource<Element>();

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // Example data
    const ELEMENT_DATA: Element[] = [
      { id: 1, type: 'Produs', name: 'Element 1', categoryName: 'Category 1', categoryId: 1, description: 'Description for Element 1', aquisitionPrice: 10, sellingPrice: 20, taxValue: 5, taxId: 1 },
      { id: 2, type: 'Serviciu', name: 'Element 2', categoryName: 'Category 2', categoryId: 2, description: 'Description for Element 2', aquisitionPrice: 15, sellingPrice: 25, taxValue: 10, taxId: 2 },
      { id: 3, type: 'Produs', name: 'Element 3', categoryName: 'Category 1', categoryId: 1, description: 'Description for Element 3', aquisitionPrice: 10, sellingPrice: 20, taxValue: 5, taxId: 1 },
      { id: 4, type: 'Serviciu', name: 'Element 4', categoryName: 'Category 2', categoryId: 2, description: 'Description for Element 4', aquisitionPrice: 15, sellingPrice: 25, taxValue: 10, taxId: 2 },
      { id: 5, type: 'Produs', name: 'Element 5', categoryName: 'Category 1', categoryId: 1, description: 'Description for Element 5', aquisitionPrice: 10, sellingPrice: 20, taxValue: 5, taxId: 1 },
      { id: 6, type: 'Serviciu', name: 'Element 6', categoryName: 'Category 2', categoryId: 2, description: 'Description for Element 6', aquisitionPrice: 15, sellingPrice: 25, taxValue: 10, taxId: 2 },
      { id: 7, type: 'Produs', name: 'Element 7', categoryName: 'Category 1', categoryId: 1, description: 'Description for Element 7', aquisitionPrice: 10, sellingPrice: 20, taxValue: 5, taxId: 1 },
      { id: 8, type: 'Serviciu', name: 'Element 8', categoryName: 'Category 2', categoryId: 2, description: 'Description for Element 8', aquisitionPrice: 15, sellingPrice: 25, taxValue: 10, taxId: 2 },
      { id: 9, type: 'Produs', name: 'Element 9', categoryName: 'Category 1', categoryId: 1, description: 'Description for Element 9', aquisitionPrice: 10, sellingPrice: 20, taxValue: 5, taxId: 1 },
      { id: 10, type: 'Serviciu', name: 'Element 10', categoryName: 'Category 2', categoryId: 2, description: 'Description for Element 10', aquisitionPrice: 15, sellingPrice: 25, taxValue: 10, taxId: 2 },
      { id: 11, type: 'Produs', name: 'Element 11', categoryName: 'Category 1', categoryId: 1, description: 'Description for Element 11', aquisitionPrice: 10, sellingPrice: 20, taxValue: 5, taxId: 1 },
      { id: 12, type: 'Serviciu', name: 'Element 12', categoryName: 'Category 2', categoryId: 2, description: 'Description for Element 12', aquisitionPrice: 15, sellingPrice: 25, taxValue: 10, taxId: 2 }
      // Add more data as needed
    ];

    this.dataSource.data = ELEMENT_DATA;

    this.fetchData();

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
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
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

  onPaginatorPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const length = this.dataSource.data.length; // Total number of items

    // Now you have the pagination details, you can use them as needed
    console.log(`Page index: ${pageIndex}, Page size: ${pageSize}, Total items: ${length}`);

    // Here you can call your function to fetch data from the backend with these pagination details
    // For example:
    // this.fetchDataFromBackend(pageIndex, pageSize);
  }
  
  fetchData(){
    this.apiService.get<Element[]>('financial/element/').subscribe({
      next: (data: Element[]) => {
        this.dataSource.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching elements', error);
      },
      complete: () => {
        console.info('elements data fetch complete');
      }
    });
  }
}