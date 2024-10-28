import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RingtonesPageRoutingModule } from './ringtones-routing.module';

import { RingtonesPage } from './ringtones.page';
import { DefaultRingtonesComponent } from '../components/default-ringtones/default-ringtones.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RingtonesPageRoutingModule
  ],
  declarations: [RingtonesPage, DefaultRingtonesComponent]
})
export class RingtonesPageModule {}
