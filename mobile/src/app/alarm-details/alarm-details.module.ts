import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlarmDetailsPageRoutingModule } from './alarm-details-routing.module';
import { AlarmDetailsPage } from './alarm-details.page';
import { AlarmInfoComponent } from '../components/alarm-info/alarm-info.component';
import { AutocompleteAddressComponent } from '../components/autocomplete-address/autocomplete-address.component';
import { GeoapifyGeocoderAutocompleteModule } from '@geoapify/angular-geocoder-autocomplete';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlarmDetailsPageRoutingModule,
    GeoapifyGeocoderAutocompleteModule.withConfig(environment.geoapifyKey)
  ],
  declarations: [AlarmDetailsPage, AlarmInfoComponent, AutocompleteAddressComponent]
})
export class AlarmDetailsPageModule {}