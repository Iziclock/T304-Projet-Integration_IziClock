import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAlarmPageRoutingModule } from './edit-alarm-routing.module';

import { EditAlarmPage } from './edit-alarm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditAlarmPageRoutingModule
  ],
  declarations: [EditAlarmPage]
})
export class EditAlarmPageModule {}
