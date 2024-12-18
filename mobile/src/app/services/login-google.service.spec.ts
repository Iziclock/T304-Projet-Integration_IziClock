import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginGoogleService } from './login-google.service';
import { environment } from 'src/environments/environment';

describe('LoginGoogleService', () => {
  let service: LoginGoogleService;
  let httpMock: HttpTestingController;

  const mockResponse = 'Login successful';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginGoogleService],
    });
    service = TestBed.inject(LoginGoogleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get login response', () => {
    service.getLogin().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.api}/calendars/login`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});