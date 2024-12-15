import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AlarmsListComponent } from './alarms-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlarmService } from 'src/app/services/alarm.service';
import { alarm } from 'src/app/classes/alarms';
import { Alarm, AlarmData } from 'src/app/interfaces/alarms';
import { of } from 'rxjs';

describe('AlarmsListComponent', () => {
  let component: AlarmsListComponent;
  let fixture: ComponentFixture<AlarmsListComponent>;
  let alarmService: AlarmService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlarmsListComponent],
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [AlarmService]
    }).compileComponents();

    fixture = TestBed.createComponent(AlarmsListComponent);
    component = fixture.componentInstance;
    alarmService = TestBed.inject(AlarmService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('alarm class', () => {
    let alarmData: AlarmData;

    beforeEach(() => {
      alarmData = {
        ID: 1,
        CalendarID: 'calendar123',
        Name: 'Morning Alarm',
        Description: 'Wake up for work',
        RingDate: '2024-12-20T07:00:00Z',
        CreatedAt: '2024-11-10T08:30:00Z',
        LocationStart: 'Home',
        LocationEnd: 'Office',
        Ringtone: 'beep',
        Transport: 'car',
        IsActive: true
      };
    });

    it('should create an instance of alarm with correct properties', () => {
      const createdAlarm = new alarm(alarmData);

      expect(createdAlarm).toBeTruthy();
      expect(createdAlarm.id).toBe(alarmData.ID);
      expect(createdAlarm.calendarId).toBe(alarmData.CalendarID);
      expect(createdAlarm.name).toBe(alarmData.Name);
      expect(createdAlarm.description).toBe(alarmData.Description);
      expect(createdAlarm.ringDate).toEqual(new Date(alarmData.RingDate));
      expect(createdAlarm.createdAt).toEqual(new Date(alarmData.CreatedAt));
      expect(createdAlarm.locationStart).toBe(alarmData.LocationStart);
      expect(createdAlarm.locationEnd).toBe(alarmData.LocationEnd);
      expect(createdAlarm.ringtone).toBe(alarmData.Ringtone);
      expect(createdAlarm.transport).toBe(alarmData.Transport);
      expect(createdAlarm.active).toBe(alarmData.IsActive);
    });

    it('should initialize ringDate and createdAt as Date objects', () => {
      const createdAlarm = new alarm(alarmData);

      expect(createdAlarm.ringDate instanceof Date).toBeTrue();
      expect(createdAlarm.createdAt instanceof Date).toBeTrue();
    });

    it('should have the correct default state for active', () => {
      const createdAlarm = new alarm(alarmData);
      expect(createdAlarm.active).toBe(true);
    });

    it('should correctly parse the date strings into Date objects', () => {
      const createdAlarm = new alarm(alarmData);
      const expectedRingDate = new Date(alarmData.RingDate);
      const expectedCreatedAt = new Date(alarmData.CreatedAt);

      expect(createdAlarm.ringDate).toEqual(expectedRingDate);
      expect(createdAlarm.createdAt).toEqual(expectedCreatedAt);
    });
  });

  describe('previousDay()', () => {
    it('should decrease selectedDate and filter alarms', () => {
      const initialDate = component.selectedDate.getTime();
      spyOn(component, 'filterAlarmsByDate');
      component.previousDay();

      expect(component.selectedDate.getTime()).toBeLessThan(initialDate);
      expect(component.filterAlarmsByDate).toHaveBeenCalled();
    });

    it('should not change selectedDate when disablePrevious is true', () => {
      component.disablePrevious = true;
      const initialDate = component.selectedDate;
      component.previousDay();

      expect(component.selectedDate).toEqual(initialDate);
    });
  });

  describe('nextDay()', () => {
    it('should increase selectedDate and filter alarms', () => {
      const initialDate = component.selectedDate.getTime();
      spyOn(component, 'filterAlarmsByDate'); 
      component.nextDay();

      expect(component.selectedDate.getTime()).toBeGreaterThan(initialDate);
      expect(component.filterAlarmsByDate).toHaveBeenCalled();
    });

    it('should not change selectedDate when disableNext is true', () => {
      component.disableNext = true;
      const initialDate = component.selectedDate;
      component.nextDay();

      expect(component.selectedDate).toEqual(initialDate);
    });
  });

  describe('onToggleChanged()', () => {
    it('should call updateAlarmState when toggle is changed', () => {
      const alarmToUpdate = {
        id: 1,
        calendarId: 'calendar1',
        name: 'Morning Alarm',
        description: 'Wake up',
        ringDate: new Date(),
        createdAt: new Date(),
        locationStart: 'Home',
        locationEnd: 'Work',
        ringtone: 'beep',
        transport: 'car',
        active: true
      };
      const event = { detail: { checked: false } };

      spyOn(alarmService, 'updateAlarmState').and.returnValue(of(alarmToUpdate));

      component.onToggleChanged(alarmToUpdate, event);

      expect(alarmService.updateAlarmState).toHaveBeenCalledWith(alarmToUpdate);
      expect(alarmToUpdate.active).toBe(false);
    });
  });

  describe('setAlarms()', () => {
    it('should call alarmService.getAlarms and update alarms list', () => {
      const mockAlarms: Alarm[] = [
        {
          id: 1,
          calendarId: 'calendar123',
          name: 'Morning Alarm',
          description: 'Wake up for work',
          ringDate: new Date('2024-12-20T07:00:00Z'),
          createdAt: new Date('2024-11-10T08:30:00Z'),
          locationStart: 'Home',
          locationEnd: 'Office',
          ringtone: 'beep',
          transport: 'car',
          active: true
        }
      ];

      spyOn(alarmService, 'getAlarms').and.returnValue(of(mockAlarms));
      component.setAlarms();

      expect(alarmService.getAlarms).toHaveBeenCalled();
      expect(component.alarms.length).toBe(1);
    });
  });
});
