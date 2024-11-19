import { Component, ElementRef, ViewChild, AfterViewInit, input, Input, Output, EventEmitter } from '@angular/core';
import { GeocoderAutocomplete, GeocoderAutocompleteOptions } from '@geoapify/geocoder-autocomplete';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-autocomplete-address',
  templateUrl: './autocomplete-address.component.html',
  styleUrls: ['./autocomplete-address.component.scss'],
})
export class AutocompleteAddressComponent {
  @ViewChild('autocompleteContainer', { static: true }) autocompleteContainer!: ElementRef;

  //private geocoderAutocomplete!: GeocoderAutocomplete;
  @Input() options: GeocoderAutocompleteOptions = {};

  @Output() placeSelected: EventEmitter<any> = new EventEmitter();

  constructor() { }

  selectedEvent(location: Event): void {
    console.log("Selected location: ", location);
    this.placeSelected.emit(location);
  }

  suggestionsChanged(suggestions: Event): void {
    console.log("Suggestions: ", suggestions);
  }

  /*ngAfterViewInit(): void {
    const container: any = this.autocompleteContainer.nativeElement;
    const options: GeocoderAutocompleteOptions = {
      limit: 5,
    }

    this.geocoderAutocomplete = new GeocoderAutocomplete(container, environment.geoapifyKey, options);

    this.geocoderAutocomplete.on('select', (location) => {
      console.log("Selected location: ", location);
    });

    this.geocoderAutocomplete.on('suggestions', (suggestions) => {
      console.log("Suggestions: ", suggestions);
    });
  }*/
}
