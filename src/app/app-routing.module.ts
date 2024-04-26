import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElementsComponent } from './Components/elemenents-component/elements.component';
import { DashboardComponent } from './Components/dashboard-component/dashboard.component';

const routes: Routes = [{ path: '', redirectTo: '/Tabloudebord', pathMatch: 'full' },
{ path: 'Tabloudebord', component: DashboardComponent},
{ path: 'Elemente', component: ElementsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
