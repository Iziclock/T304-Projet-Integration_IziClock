import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AlarmsListComponent } from '../components/alarms-list/alarms-list.component';
import { RingdatePipe } from '../pipes/ringdate.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    RingdatePipe
],
  declarations: [HomePage, AlarmsListComponent]
})
export class HomePageModule {}
