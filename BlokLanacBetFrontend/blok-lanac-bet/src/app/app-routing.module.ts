import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MakeBetComponent } from './make-bet/make-bet.component';
import { HomeComponent } from './_home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'make-bet', component: MakeBetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
