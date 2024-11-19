import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditAlarmePage } from './edit-alarme.page';

const routes: Routes = [
  {
    path: '',
    component: EditAlarmePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAlarmePageRoutingModule {}