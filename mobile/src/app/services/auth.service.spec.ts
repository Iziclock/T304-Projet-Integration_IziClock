import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockResponse = { access_token: 'mock_access_token' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve token and store in localStorage', () => {
    const code = 'mock_code';
    spyOn(localStorage, 'setItem');

    service.retrieveTokenLazy(code);

    const req = httpMock.expectOne(`${environment.api}/calendars/api?code=${code}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('access_token', JSON.stringify(mockResponse));
  });

  it('should handle error response when retrieving token', () => {
    const code = 'mock_code';
    const errorMessage = 'Error fetching token';

    spyOn(localStorage, 'setItem');

    service.retrieveTokenLazy(code);

    const req = httpMock.expectOne(`${environment.api}/calendars/api?code=${code}`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
});