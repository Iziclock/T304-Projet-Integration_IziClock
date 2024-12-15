import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteAddressComponent } from './autocomplete-address.component';

describe('AutocompleteAddressComponent', () => {
  let component: AutocompleteAddressComponent;
  let fixture: ComponentFixture<AutocompleteAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the value when writeValue is called', () => {
    const testLocation = 'Test Location';
    component.writeValue(testLocation);
    expect(component.value).toBe(testLocation);
  });

  it('should call onTouched when markAsTouched is called', () => {
    spyOn(component, 'onTouched');
    component.markAsTouched();
    expect(component.onTouched).toHaveBeenCalled();
  });

  it('should set disabled state', () => {
    expect(component.disabled).toBeFalse();
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });

  it('should register onChange callback', () => {
    const callback = jasmine.createSpy();
    component.registerOnChange(callback);

    const testLocation = 'New York';
    component.onChange(testLocation);

    expect(callback).toHaveBeenCalledWith(testLocation);
  });

  it('should emit placeSelected when selectedEvent is called', () => {
    const testLocation = {
      properties: {
        formatted: 'Test Location'
      }
    };
    spyOn(component.placeSelected, 'emit');
    component.selectedEvent(testLocation);
    
    expect(component.placeSelected.emit).toHaveBeenCalledWith('Test Location');
  });

  it('should log suggestions when suggestionsChanged is called', () => {
    spyOn(console, 'log');
    const mockEvent = new Event('input');
    component.suggestionsChanged(mockEvent);

    expect(console.log).toHaveBeenCalledWith('Suggestions: ', mockEvent);
  });
});
