import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog-component/delete-dialog.component';
import { Bill, DetailedInvoice, Invoice, Organization, Partner } from '../../../Utilities/Models';
import { ApiService } from '../../../Services/ApiService';
import { InvoiceDirection } from '../../../Utilities/Enums';
import { InvoicePdfService } from '../../../Services/InvoicePDFService';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'invoiceDate', 'dueDate', 'completed', 'partnerName', 'invoiceNumber', 'total'];
  dataSource: MatTableDataSource<Bill>;
  searchControl: FormControl = new FormControl('');
  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Bill>(this.allowMultiSelect, this.initialSelection);
  

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog, private router: Router, private apiService: ApiService, private invoicePdfService: InvoicePdfService) {
    this.dataSource = new MatTableDataSource<Bill>();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.fetchData();

    // Subscribe to search input changes
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
      data: { title: 'Confirma stergerea', message: 'Esti sigur ca vrei sa stergi aceasta factura si toate tranzactiile aferente ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = this.selection.selected.map(invoice => invoice.id)[0];
        
        this.apiService.delete(`financial/invoice/${id}`).subscribe({
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

  addBill() {
    this.router.navigate(['/FacturaNoua']);
  }

  addPayment(){
    
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
    this.apiService.get<Bill[]>('financial/invoice/').subscribe({
      next: (data: Bill[]) => {

        data.forEach(bill => {
          bill.invoiceDate = new Date(bill.invoiceDate).toISOString().split('T')[0];
          bill.dueDate = new Date(bill.dueDate).toISOString().split('T')[0];
          bill.completed = bill.completed ? 'Finalizat' : 'Nefinalizat';
        });

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

  async generatePdf() {
    if (!this.isSingleSelection()) {
      console.error('Please select a single invoice to generate PDF');
      return;
    }
  
    const selectedId = this.selection.selected[0].id;
    try {
      const detailedInvoice = await this.fetchDetailedInvoiceFromBackend(selectedId);
      this.invoicePdfService.generatePdf(detailedInvoice);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Handle error (e.g., show an error message to the user)
    }
  }
  
  async fetchDetailedInvoiceFromBackend(id: number): Promise<DetailedInvoice> {
    try {
      const [organization, organizationWithName, invoice] = await Promise.all([
        this.fetchOrganizationInfo(),
        this.fetchOrganization(),
        this.fetchInvoice(id)
      ]);
  
      if (!invoice) {
        throw new Error('Invoice not found');
      }
  
      const partner = await this.fetchPartner(invoice.partnerId);
  
      if (!partner) {
        throw new Error('Partner not found');
      }

      organization.name = organizationWithName.name;
  
      return {
        organization,
        partner,
        invoice
      };
    } catch (error) {
      console.error('Error fetching detailed invoice:', error);
      throw error;
    }
  }
  
  async fetchOrganizationInfo(): Promise<Organization> {
    return await firstValueFrom(this.apiService.get<Organization>('organization/info'));
  }

  async fetchOrganization(): Promise<Organization> {
    return await firstValueFrom(this.apiService.get<Organization>('organization/'));
  }
  
  async fetchPartner(partnerId: number): Promise<Partner> {
    return await firstValueFrom(this.apiService.get<Partner>(`partner/${partnerId}`));
  }
  
  async fetchInvoice(invoiceId: number): Promise<Invoice> {
    return await firstValueFrom(this.apiService.get<Invoice>(`financial/invoice/${invoiceId}`));
  }

  editBill() {
    if (this.isSingleSelection()) {
      const selectedId = this.selection.selected[0].id;
      this.router.navigate(['/EditareFactura', selectedId]);
    }
  }
}