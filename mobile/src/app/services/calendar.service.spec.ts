import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CalendarService } from './calendar.service';
import { environment } from 'src/environments/environment';

describe('CalendarService', () => {
  let service: CalendarService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.api}/calendars`; 

  const mockCalendars = [
    { id: 1, name: 'Calendar 1', isActive: true },
    { id: 2, name: 'Calendar 2', isActive: false }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  
      providers: [CalendarService],
    });
    service = TestBed.inject(CalendarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch calendars', () => {
    service.getCalendars().subscribe(calendars => {
      expect(calendars).toEqual(mockCalendars);
    });

    const req = httpMock.expectOne(`${baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCalendars);  
  });

  it('should delete a calendar', () => {
    const calendarId = 1;

    service.deleteCalendar(calendarId).subscribe(response => {
      expect(response).toBeNull(); 
    });

    const req = httpMock.expectOne(`${baseUrl}/${calendarId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); 
  });

  it('should change calendar active state', () => {
    const calendarId = 2;

    service.changeIsActiveState(calendarId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/state/${calendarId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(null); 
  });
});
