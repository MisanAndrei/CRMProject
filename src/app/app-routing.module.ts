import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementsComponent } from './Components/elements/elemenents-component/elements.component';
import { DashboardComponent } from './Components/dashboard-component/dashboard.component';
import { UpsertElementComponent } from './Components/elements/element-upsert-component/upsert-element.component';
import { PartnersComponent } from './Components/partners-component/partners.component';

const routes: Routes = [{ path: '', redirectTo: '/Tabloudebord', pathMatch: 'full' },
{ path: 'Tabloudebord', component: DashboardComponent},
{ path: 'Elemente', component: ElementsComponent},
{ path: 'AdaugaElement', component: UpsertElementComponent},
{ path: 'Parteneri', component: PartnersComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
