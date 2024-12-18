import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlarmService } from './alarm.service';
import { Alarm, AlarmData } from '../interfaces/alarms';
import { environment } from 'src/environments/environment';

describe('AlarmService', () => {
  let service: AlarmService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.api}/alarms`;

  const mockAlarms: Alarm[] = [
    { id: 1, calendarId: 'calendar1', name: 'Alarm 1', description: 'Test Alarm 1', ringDate: new Date(), preparationTime: 0, createdAt: new Date(), locationStart: 'Home', locationEnd: 'Office', ringtone: 'Classic', transport: 'Car', active: true },
    { id: 2, calendarId: 'calendar2', name: 'Alarm 2', description: 'Test Alarm 2', ringDate: new Date(), preparationTime: 0, createdAt: new Date(), locationStart: 'Home', locationEnd: 'School', ringtone: 'Beep', transport: 'Bus', active: false }
  ];

  const mockAlarmData: AlarmData = { ID: 1, CalendarID: 'calendar1', Name: 'Alarm 1', Description: 'Test Alarm 1', RingDate: '2024-12-15T07:00:00', PreparationTime: 0, CreatedAt: '2024-12-01T00:00:00', LocationStart: 'Home', LocationEnd: 'Office', Ringtone: 'Classic', Transport: 'Car', IsActive: true };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  
      providers: [AlarmService]
    });
    service = TestBed.inject(AlarmService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch alarms', () => {
    service.getAlarms().subscribe(alarms => {
      expect(alarms.length).toBe(2);
      expect(alarms).toEqual(mockAlarms);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockAlarms); 
  });

  it('should update alarm state', () => {
    const alarmToUpdate = { ...mockAlarms[0], active: false };

    service.updateAlarmState(alarmToUpdate).subscribe(updatedAlarm => {
      expect(updatedAlarm.active).toBe(false);
    });

    const req = httpMock.expectOne(`${baseUrl}/state/${mockAlarms[0].id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(alarmToUpdate);
    req.flush(alarmToUpdate);  
  });

  it('should update alarm details', () => {
    const updatedAlarmData: AlarmData = { ...mockAlarmData, Name: 'Updated Alarm 1' };

    service.updateAlarmDetails(updatedAlarmData).subscribe(updatedData => {
      expect(updatedData.Name).toBe('Updated Alarm 1');
    });

    const req = httpMock.expectOne(`${baseUrl}/${mockAlarmData.ID}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedAlarmData);
    req.flush(updatedAlarmData); 
  });

  it('should fetch alarm by id', () => {
    service.getAlarmById(mockAlarmData.ID).subscribe(data => {
      expect(data).toEqual(mockAlarmData);
    });

    const req = httpMock.expectOne(`${baseUrl}/${mockAlarmData.ID}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAlarmData);  
  });

  it('should call PUT API to set alarms by default', () => {
    service.setAlarmsByDefault().subscribe((data) => {
      expect(data).toEqual(mockAlarms);
    });

    const req = httpMock.expectOne(`${baseUrl}/default`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockAlarms); // Simule une réponse avec les données mockées
  });
});
