import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog-component/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Transfer } from '../../../Utilities/Models';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'fromBankAccountName', 'toBankAccountName', 'amount', 'date', 'paymentMethod', 'reference', 'description'];
  dataSource: MatTableDataSource<Transfer>;
  searchControl: FormControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Transfer>(this.allowMultiSelect, this.initialSelection);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog, private router: Router) {
    this.dataSource = new MatTableDataSource<Transfer>();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // Example data
    const TRANSFER_DATA: Transfer[] = [
      { id: 1, fromBankAccountId: 1, fromBankAccountName: 'Account A', toBankAccountId: 2, toBankAccountName: 'Account B', amount: 100.50, date: new Date('2023-05-20'), paymentMethod: 'Credit Card', reference: 'Ref001', description: 'Transfer Description A' },
      { id: 2, fromBankAccountId: 3, fromBankAccountName: 'Account C', toBankAccountId: 4, toBankAccountName: 'Account D', amount: 200.75, date: new Date('2023-05-21'), paymentMethod: 'Bank Transfer', reference: 'Ref002', description: 'Transfer Description B' },
      { id: 3, fromBankAccountId: 5, fromBankAccountName: 'Account E', toBankAccountId: 6, toBankAccountName: 'Account F', amount: 300.00, date: new Date('2023-05-22'), paymentMethod: 'Cash', reference: 'Ref003', description: 'Transfer Description C' },
    ];

    this.dataSource.data = TRANSFER_DATA;

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
    return numSelected === numRows;
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
      data: { title: 'Confirm deletion', message: 'Are you sure you want to delete these transfers?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(transfer => transfer.id);
        // Call your function to delete transfers using selectedIds
      }
      this.selection.clear();
    });
  }

  addTransfer() {
    this.router.navigate(['/TransferNou']);
  }

  onPaginatorPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    const length = this.dataSource.data.length;

    console.log(`Page index: ${pageIndex}, Page size: ${pageSize}, Total items: ${length}`);
  }
}