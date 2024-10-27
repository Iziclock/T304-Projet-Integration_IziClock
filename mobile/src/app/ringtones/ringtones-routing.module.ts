import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RingtonesPage } from './ringtones.page';

const routes: Routes = [
  {
    path: '',
    component: RingtonesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RingtonesPageRoutingModule {}
