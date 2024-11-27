import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditAlarmePageRoutingModule } from './edit-alarm-routing.module';

import { EditAlarmePage } from './edit-alarm.page';
import { AutocompleteAddressComponent } from '../components/autocomplete-address/autocomplete-address.component';
import { GeoapifyGeocoderAutocompleteModule } from '@geoapify/angular-geocoder-autocomplete';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditAlarmePageRoutingModule,
    GeoapifyGeocoderAutocompleteModule.withConfig(environment.geoapifyKey)
  ],
  declarations: [EditAlarmePage, AutocompleteAddressComponent]
})
export class EditAlarmePageModule {}
