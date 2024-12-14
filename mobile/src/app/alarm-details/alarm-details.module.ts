import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlarmDetailsPageRoutingModule } from './alarm-details-routing.module';
import { AlarmDetailsPage } from './alarm-details.page';
import { AlarmInfoComponent } from '../components/alarm-info/alarm-info.component';
import { TimePipe } from '../pipes/time.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmDetailsPageRoutingModule,
    TimePipe
  ],
  declarations: [AlarmDetailsPage, AlarmInfoComponent]
})
export class AlarmDetailsPageModule {}