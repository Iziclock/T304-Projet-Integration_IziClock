import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfMenuPageRoutingModule } from './conf-menu-routing.module';

import { ConfMenuPage } from './conf-menu.page';
import { ConfigListComponent } from '../components/config-list/config-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfMenuPageRoutingModule
  ],
  declarations: [ConfMenuPage, ConfigListComponent]
})
export class ConfMenuPageModule {}
