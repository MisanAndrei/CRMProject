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
import { LoginComponent } from './Components/login/login.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: 'Tabloudebord', component: DashboardComponent, canActivate: [AuthGuard]},
{ path: 'Elemente', component: ElementsComponent, canActivate: [AuthGuard]},
{ path: 'AdaugaElement', component: UpsertElementComponent, canActivate: [AuthGuard]},
{ path: 'Parteneri', component: PartnersComponent, canActivate: [AuthGuard]},
{ path: 'Facturi', component: BillsComponent, canActivate: [AuthGuard]},
{ path: 'Conturi', component: AccountsComponent, canActivate: [AuthGuard]},
{ path: 'Tranzactii', component: TransactionsComponent, canActivate: [AuthGuard]},
{ path: 'Categorii', component: CategoriesComponent, canActivate: [AuthGuard]},
{ path: 'Valute', component: CurrenciesComponent, canActivate: [AuthGuard]},
{ path: 'Taxe', component: TaxesComponent, canActivate: [AuthGuard]},
{ path: 'FacturaNoua', component: BillUpsertComponent, canActivate: [AuthGuard]},
{ path: 'Companie', component: CompanyComponent, canActivate: [AuthGuard]},
{ path: 'Implicit', component: ImplicitComponent, canActivate: [AuthGuard]},
{ path: 'Preferinte', component: BillPreferencesComponent, canActivate: [AuthGuard]},
{ path: 'TransferNou', component: TransferUpsertComponent, canActivate: [AuthGuard]},
{ path: 'Transferuri', component: TransfersComponent, canActivate: [AuthGuard]},
{ path: 'ContNou', component: AccountUpsertComponent, canActivate: [AuthGuard]},
{ path: 'PartenerNou', component: PartnerUpsertComponent, canActivate: [AuthGuard]},
{ path: 'TranzactieNoua', component: TransactionUpsertComponent, canActivate: [AuthGuard]},
{ path: 'TaxaNoua', component: TaxesUpsertComponent, canActivate: [AuthGuard]},
{ path: 'CategorieNoua', component: CategoriesUpsertComponent, canActivate: [AuthGuard]},
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: '**', redirectTo: '/login' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
