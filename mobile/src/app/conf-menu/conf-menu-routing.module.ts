import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfMenuPage } from './conf-menu.page';

const routes: Routes = [
  {
    path: '',
    component: ConfMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfMenuPageRoutingModule {}
