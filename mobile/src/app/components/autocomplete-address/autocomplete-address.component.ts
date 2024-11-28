import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GeocoderAutocompleteOptions } from '@geoapify/geocoder-autocomplete';

@Component({
  selector: 'app-autocomplete-address',
  templateUrl: './autocomplete-address.component.html',
  styleUrls: ['./autocomplete-address.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AutocompleteAddressComponent
    }
  ]
})
export class AutocompleteAddressComponent implements ControlValueAccessor{
  @ViewChild('autocompleteContainer', { static: true }) autocompleteContainer!: ElementRef;

  value: string = '';
  @Input() options: GeocoderAutocompleteOptions = {};

  @Output() placeSelected: EventEmitter<string> = new EventEmitter();

  constructor() { }

  writeValue(location: string): void {
    this.value = location;
  }

  onChange = (location: string) => {};
  onTouched = () => {};

  touched: boolean = false;

  disabled: boolean = false;

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  selectedEvent(location: any): void {
    console.log("Selected location: ", location);
    this.placeSelected.emit(location['properties']['formatted']);
    this.onChange(location['properties']['formatted']);
  }

  suggestionsChanged(suggestions: Event): void {
    console.log("Suggestions: ", suggestions);
  }
}
