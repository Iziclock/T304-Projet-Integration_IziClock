import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiddlewarePageRoutingModule } from './middleware-routing.module';

import { MiddlewarePage } from './middleware.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiddlewarePageRoutingModule
  ],
  declarations: [MiddlewarePage]
})
export class MiddlewarePageModule {}
