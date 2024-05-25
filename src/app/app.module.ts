import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElementsComponent } from './Components/elements/elemenents-component/elements.component';
import { DashboardComponent } from './Components/dashboard-component/dashboard.component';
import { UpsertElementComponent } from './Components/elements/element-upsert-component/upsert-element.component';
import { PartnersComponent } from './Components/partners-component/partners.component';
import { BillsComponent } from './Components/bills/bills-component/bills.component';
import { AccountsComponent } from './Components/accounts/accounts-component/accounts.component';
import { TransactionsComponent } from './Components/transactions/transactions-component/transactions.component';
import { CategoriesComponent } from './Components/categories/categories-component/categories.component';
import { CurrenciesComponent } from './Components/currencies/currencies-component/currencies.component';
import { TaxesComponent } from './Components/taxes/taxes-component/taxes.component';
import { BillUpsertComponent } from './Components/bills/bill-upsert-component/bill-upsert.component';
import { CompanyComponent } from './Components/company/company.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ElementsComponent,
    DashboardComponent,
    UpsertElementComponent,
    PartnersComponent,
    BillsComponent,
    AccountsComponent,
    TransactionsComponent,
    CategoriesComponent,
    CurrenciesComponent,
    TaxesComponent,
    BillUpsertComponent,
    CompanyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule,
    MatChipsModule,
    MatSelectModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
