import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarsPageRoutingModule } from './calendars-routing.module';

import { CalendarsPage } from './calendars.page';
import { CalendarsManagementComponent } from '../components/calendars-management/calendars-management.component';
import { LoginGoogleComponent } from '../components/login-google/login-google.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarsPageRoutingModule
  ],
  declarations: [CalendarsPage, CalendarsManagementComponent,LoginGoogleComponent]
})
export class CalendarsPageModule {}
