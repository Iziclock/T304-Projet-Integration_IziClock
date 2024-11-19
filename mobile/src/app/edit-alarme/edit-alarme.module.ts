import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAlarmePageRoutingModule } from './edit-alarme-routing.module';

import { EditAlarmePage } from './edit-alarme.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAlarmePageRoutingModule
  ],
  declarations: [EditAlarmePage]
})
export class EditAlarmePageModule {}
