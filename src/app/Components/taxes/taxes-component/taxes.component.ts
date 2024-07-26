import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Tax } from '../../../Utilities/Models';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog-component/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../../../Services/ApiService';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'name', 'percent'];
  dataSource: MatTableDataSource<Tax>;
  searchControl: FormControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Tax>(this.allowMultiSelect, this.initialSelection);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog, private router: Router, private apiService: ApiService) {
    this.dataSource = new MatTableDataSource<Tax>();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    this.fetchTaxes();

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
      data: { title: 'Confirma stergerea', message: 'Esti sigur ca vrei sa stergi aceasta taxa?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(tax => tax.id);
        
        this.apiService.delete(`financial/tax/${selectedIds}`).subscribe({
          next: () => {
            console.log('Stergere completa');
            this.fetchTaxes();
          },
          error: (error) => {
            console.error('Error fetching elements', error);
          },
          complete: () => {
            console.info('elements data fetch complete');
          }
        });
      }
      this.selection.clear();
    });
  }

  addTax() {
    this.router.navigate(['/TaxaNoua']);
  }

  onPaginatorPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const length = this.dataSource.data.length;

    console.log(`Page index: ${pageIndex}, Page size: ${pageSize}, Total items: ${length}`);
    // Here you can call your function to fetch data from the backend with these pagination details
  }

  fetchTaxes() {
    this.apiService.get<Tax[]>('financial/tax/').subscribe({
      next: (data: Tax[]) => {
        this.dataSource.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching categories', error);
      },
      complete: () => {
        console.info('categories data fetch complete');
      }
    });
  }

  editTax() {
    if (this.isSingleSelection()) {
      const selectedElementTaxId = this.selection.selected[0].id;
      this.router.navigate(['/EditareTaxa', selectedElementTaxId]);
    }
  }
}