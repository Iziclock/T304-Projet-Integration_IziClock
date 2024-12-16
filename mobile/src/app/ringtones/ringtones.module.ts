import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RingtonesPageRoutingModule } from './ringtones-routing.module';

import { RingtonesPage } from './ringtones.page';
import { AddRingtoneComponent } from '../components/add-ringtone/add-ringtone.component';
import { RingtonesListComponent } from '../components/ringtones-list/ringtones-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RingtonesPageRoutingModule
  ],
  declarations: [RingtonesPage, RingtonesListComponent, AddRingtoneComponent]
})
export class RingtonesPageModule {}
