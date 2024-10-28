import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlarmDetailsPage } from './alarm-details.page';

const routes: Routes = [
  {
    path: '',
    component: AlarmDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlarmDetailsPageRoutingModule {}
