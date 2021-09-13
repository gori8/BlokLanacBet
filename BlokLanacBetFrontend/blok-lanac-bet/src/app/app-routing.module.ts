import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BetHistoryComponent } from './bet-history/bet-history.component';
import { HomeComponent } from './_home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bet/history', component: BetHistoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
