import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Transaction } from '../../../Utilities/Models';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog-component/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TransactionDirection } from '../../../Utilities/Enums';
import { ApiService } from '../../../Services/ApiService';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'paymentDate', 'invoiceId', 'reference', 'amount', 'paymentDirection', 'bankAccountId', 'paymentMethod', 'description'];
  dataSource: MatTableDataSource<Transaction>;
  searchControl: FormControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Transaction>(this.allowMultiSelect, this.initialSelection);
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog, private router: Router, private apiService: ApiService) {
    this.dataSource = new MatTableDataSource<Transaction>();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
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
      data: { title: 'Confirm deletion', message: 'Are you sure you want to delete these transactions?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(transaction => transaction.id);
        // Call your function to delete transactions using selectedIds
      }
      this.selection.clear();
    });
  }

  addTransaction() {
    this.router.navigateByUrl('/TranzactieNoua');
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
    this.apiService.get<Transaction[]>('financial/invoice/payments').subscribe({
      next: (data: Transaction[]) => {
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

  editTransaction() {
    if (this.isSingleSelection()) {
      const selectedTransactionId = this.selection.selected[0].id;
      this.router.navigate(['/EditareTranzactie', selectedTransactionId]);
    }
  }
}