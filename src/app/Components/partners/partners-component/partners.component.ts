import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';// Adjust this import based on your application structure
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Partner } from '../../../Utilities/Models';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog-component/delete-dialog.component';
import { ApiService } from '../../../Services/ApiService';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'name', 'cui', 'email', 'phoneNumber', 'country'];
  dataSource: MatTableDataSource<Partner>;
  searchControl: FormControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Partner>(this.allowMultiSelect, this.initialSelection);
  

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog, private router: Router, private apiService: ApiService) {
    this.dataSource = new MatTableDataSource<Partner>();
    
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
      data: { title: 'Confirma stergerea', message: 'Esti sigur ca vrei sa stergi acest partener?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(partner => partner.id);
        
        this.apiService.delete(`partner/${selectedIds}`).subscribe({
          next: () => {
            console.log('Stergere completa');
            this.fetchData();
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

  // You can add more methods specific to Partner functionality here
  
  // For example, adding a new partner
  addPartner() {
    this.router.navigate(['/PartenerNou']);
  }

  editPartner() {
    if (this.isSingleSelection()) {
      const selectedPartnerId = this.selection.selected[0].id;
      this.router.navigate(['/EditarePartener', selectedPartnerId]);
    }
  }

  fetchData(){
    this.apiService.get<Partner[]>('partner/').subscribe({
      next: (data: Partner[]) => {
        this.dataSource.data = data;
        console.log(data);
      },
      error: (error) => {
        console.error('Error fetching partners', error);
      },
      complete: () => {
        console.info('partners data fetch complete');
      }
    });
  }
}
