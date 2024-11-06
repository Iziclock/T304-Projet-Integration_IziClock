import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlarmDetailsPageRoutingModule } from './alarm-details-routing.module';
import { AlarmDetailsPage } from './alarm-details.page';
import { AlarmInfoComponent } from '../components/alarm-info/alarm-info.component';
import { MapsComponent } from '../components/maps/maps.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmDetailsPageRoutingModule,
  ],
  declarations: [AlarmDetailsPage, AlarmInfoComponent, MapsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlarmDetailsPageModule {}