import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlarmDetailsPageRoutingModule } from './alarm-details-routing.module';
import { AlarmDetailsPage } from './alarm-details.page';
import { AlarmInfoComponent } from '../components/alarm-info/alarm-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmDetailsPageRoutingModule,
  ],
  declarations: [AlarmDetailsPage, AlarmInfoComponent]
})
export class AlarmDetailsPageModule {}