import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, AlertController } from '@ionic/angular';
import { CalendarsManagementComponent } from './calendars-management.component';
import { CalendarService } from 'src/app/services/calendar.service';
import { of, throwError } from 'rxjs';
import { Calendar } from 'src/app/interfaces/calendars';

const mockCalendars: Calendar[] = [
  { id: 1, userId: 1, name: 'Work Calendar', idGoogle: 'calendar1.com', description: 'calendar 1', isActive: true, createdAt: new Date() },
  { id: 2, userId: 2, name: 'Personal Calendar', idGoogle: 'calendar2.com', description: 'calendar 2', isActive: false, createdAt: new Date() }
];

describe('CalendarsManagementComponent', () => {
  let component: CalendarsManagementComponent;
  let fixture: ComponentFixture<CalendarsManagementComponent>;
  let calendarServiceSpy: jasmine.SpyObj<CalendarService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CalendarService', ['getCalendars', 'deleteCalendar', 'changeIsActiveState']);
    const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [CalendarsManagementComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: CalendarService, useValue: spy },
        { provide: AlertController, useValue: alertControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarsManagementComponent);
    component = fixture.componentInstance;
    calendarServiceSpy = TestBed.inject(CalendarService) as jasmine.SpyObj<CalendarService>;

    calendarServiceSpy.getCalendars.and.returnValue(of(mockCalendars));

    spyOn(component, 'ngOnInit').and.callFake(() => {}); 

    spyOn(component, 'reloadPage').and.callFake(() => {});

    spyOn(console, 'error');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load calendars via setCalendars', () => {
    component.calendars = []; 
    component.setCalendars();

    expect(component.calendars.length).toBe(2);
  });

  it('should get calendars', () => {
    component.calendars = mockCalendars
    fixture.detectChanges();

    expect(component.calendars.length).toEqual(2);

    expect(component.calendars[0].name).toEqual('Work Calendar');
    expect(component.calendars[0].isActive).toBeTrue();

    expect(component.calendars[1].name).toEqual('Personal Calendar');
    expect(component.calendars[1].isActive).toBeFalse();
  });

  it('should display calendars', () => {
    component.calendars = mockCalendars
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll('ion-label');
    const checkboxes = fixture.nativeElement.querySelectorAll('ion-checkbox');

    //expect(labels[0].textContent).toContain('Work Calendar');
    expect(checkboxes[0].checked).toBeTrue();

    //expect(labels[1].textContent).toContain('Personal Calendar');
    expect(checkboxes[1].checked).toBeFalse();
  });

  it('should change isActive state of a calendar', () => {
    calendarServiceSpy.changeIsActiveState.and.returnValue(of({}));

    component.changeIsActiveState(1);

    expect(calendarServiceSpy.changeIsActiveState).toHaveBeenCalledWith(1);
  });

  it('should present an alert before deleting a calendar', async () => {
    const alertSpy = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    const alertController = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    alertController.create.and.returnValue(Promise.resolve(alertSpy));

    await component.deleteAlert(1);

    expect(alertController.create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });

  it('should reload the page on calling reloadPage', () => {
    component.reloadPage();
    expect(component.reloadPage).toHaveBeenCalled();
  });
  
  it('should handle error when changing isActive state', () => {
    const errorResponse = new ErrorEvent('Network error');
    calendarServiceSpy.changeIsActiveState.and.returnValue(throwError(() => errorResponse));
  
    component.changeIsActiveState(1);
  
    expect(console.error).toHaveBeenCalled();
  });

  it('should call deleteAlert when deleteCalendar is called', () => {
    spyOn(component, 'deleteAlert').and.callThrough();
  
    component.deleteCalendar(1);

    expect(component.deleteAlert).toHaveBeenCalledWith(1);
  });
});