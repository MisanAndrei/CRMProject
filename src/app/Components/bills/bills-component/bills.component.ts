import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog-component/delete-dialog.component';
import { Bill, DetailedInvoice } from '../../../Utilities/Models';
import { ApiService } from '../../../Services/ApiService';
import { InvoiceDirection } from '../../../Utilities/Enums';
import { InvoicePdfService } from '../../../Services/InvoicePDFService';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['select', 'dateOfBill', 'maturityOfBill', 'status', 'partner', 'number', 'sum'];
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
    // Fetch list of bills from your data source
    // For demonstration, let's assume you have a function called getBills() that returns the list of bills
    const billList: Bill[] = this.getBills();
    this.dataSource.data = billList;
    //this.fetchData();

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
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete selected bills?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const selectedIds = this.selection.selected.map(bill => bill.id);
        // Call your function to delete bills using selectedIds
      }
      this.selection.clear();
    });
  }

  addBill() {
    // Navigate to the page for adding a new bill
    this.router.navigate(['/FacturaNoua']);
  }

  addPayment(){
    
  }

  getBills(): Bill[] {
    // Implement your logic to fetch bills from the data source (e.g., API)
    // For now, return a mock list of bills
    return [
      { id: 1, dateOfBill: '2022-04-01', maturityOfBill: '2022-05-01', status: 'Paid', partner: 'Partner A', number: '123', sum: '1000' },
      { id: 2, dateOfBill: '2022-04-15', maturityOfBill: '2022-05-15', status: 'Unpaid', partner: 'Partner B', number: '124', sum: '1500' },
      // Add more bills as needed
    ];
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

  generatePdf() {
    const detailedInvoice: DetailedInvoice = {
      organization: {
        name: "Furnizor SRL",
        email: "contact@furnizor.com",
        phoneNumber: "123456789",
        CUI: "RO123456",
        regCom: "J40/12345/2023",
        address: "Strada Furnizorului, Nr. 1",
        city: "Bucuresti",
        image: "", 
        postalCode: "010101",
        county: "Bucuresti",
        country: "Romania",
        colorCodeNavBar: "#000000",
        colorCodeLeftBar: "#FFFFFF",
        font: "Arial"
      },
      partner: {
        id: 1,
        name: "Client SRL",
        CUI: "RO654321",
        regCom: "J40/54321/2023",
        email: "contact@client.com",
        phoneNumber: "987654321",
        country: "Romania",
        website: "www.client.com",
        reference: "Referință client",
        address: "Strada Clientului, Nr. 2",
        city: "Cluj-Napoca",
        county: "Cluj",
        postalCode: "400001",
        image: ""
      },
      invoice: {
        id: 1,
        total: 1500,
        partnerId: 1,
        partnerName: "Client SRL",
        categoryId: 1,
        categoryName: "Servicii",
        invoiceNumber: "INV-001",
        orderNumber: "ORD-001",
        direction: InvoiceDirection.out,
        invoiceDate: new Date("2023-04-01"),
        dueDate: new Date("2023-05-01"),
        completed: false,
        remainingAmount: 500,
        elements: [
          {
            elementId: 1,
            elementName: "Serviciu A",
            elementPrice: 500,
            elementDescription: "Descriere Serviciu A",
            elementTax: 19,
            quantity: 2
          },
          {
            elementId: 2,
            elementName: "Serviciu B",
            elementPrice: 250,
            elementDescription: "Descriere Serviciu B",
            elementTax: 19,
            quantity: 2
          }
        ]
      }
    };

    this.invoicePdfService.generatePdf(detailedInvoice);
  }
}