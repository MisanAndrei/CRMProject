import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementsComponent } from './Components/elements/elemenents-component/elements.component';
import { DashboardComponent } from './Components/dashboard-component/dashboard.component';
import { UpsertElementComponent } from './Components/elements/element-upsert-component/upsert-element.component';
import { PartnersComponent } from './Components/partners/partners-component/partners.component';
import { BillsComponent } from './Components/bills/bills-component/bills.component';
import { AccountsComponent } from './Components/accounts/accounts-component/accounts.component';
import { TransactionsComponent } from './Components/transactions/transactions-component/transactions.component';
import { CategoriesComponent } from './Components/categories/categories-component/categories.component';
import { CurrenciesComponent } from './Components/currencies/currencies-component/currencies.component';
import { TaxesComponent } from './Components/taxes/taxes-component/taxes.component';
import { BillUpsertComponent } from './Components/bills/bill-upsert-component/bill-upsert.component';
import { CompanyComponent } from './Components/company/company.component';
import { ImplicitComponent } from './Components/implicit/implicit-component/implicit.component';
import { BillPreferencesComponent } from './Components/bills/bill-preferences-component/bill-preferences.component';
import { TransferUpsertComponent } from './Components/transfers/transfer-upsert-component/transfer-upsert.component';
import { TransfersComponent } from './Components/transfers/transfers-component/transfers.component';
import { AccountUpsertComponent } from './Components/accounts/account-upsert-component/account-upsert.component';
import { PartnerUpsertComponent } from './Components/partners/partner-upsert-component/partner-upsert.component';
import { TransactionUpsertComponent } from './Components/transactions/transaction-upsert-component/transaction-upsert.component';
import { TaxesUpsertComponent } from './Components/taxes/taxes-upsert-component/taxes-upsert/taxes-upsert.component';
import { CategoriesUpsertComponent } from './Components/categories/categories-upsert-component/categories-upsert/categories-upsert.component';


const routes: Routes = [{ path: '', redirectTo: '/Tabloudebord', pathMatch: 'full' },
{ path: 'Tabloudebord', component: DashboardComponent},
{ path: 'Elemente', component: ElementsComponent},
{ path: 'AdaugaElement', component: UpsertElementComponent},
{ path: 'Parteneri', component: PartnersComponent},
{ path: 'Facturi', component: BillsComponent},
{ path: 'Conturi', component: AccountsComponent},
{ path: 'Tranzactii', component: TransactionsComponent},
{ path: 'Categorii', component: CategoriesComponent},
{ path: 'Valute', component: CurrenciesComponent},
{ path: 'Taxe', component: TaxesComponent},
{ path: 'FacturaNoua', component: BillUpsertComponent},
{ path: 'Companie', component: CompanyComponent},
{ path: 'Implicit', component: ImplicitComponent},
{ path: 'Preferinte', component: BillPreferencesComponent},
{ path: 'TransferNou', component: TransferUpsertComponent},
{ path: 'Transferuri', component: TransfersComponent},
{ path: 'ContNou', component: AccountUpsertComponent},
{ path: 'PartenerNou', component: PartnerUpsertComponent},
{ path: 'TranzactieNoua', component: TransactionUpsertComponent},
{ path: 'TaxaNoua', component: TaxesUpsertComponent},
{ path: 'CategorieNoua', component: CategoriesUpsertComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
