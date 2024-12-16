import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GeoapifyService } from './geoapify.service';
import { environment } from 'src/environments/environment';

describe('GeoapifyService', () => {
  let service: GeoapifyService;
  let httpMock: HttpTestingController;

  const mockCoordinatesResponse = {
    results: [{ geometry: { lat: 52.52, lon: 13.405 } }]
  };

  const mockAddressResponse = {
    results: [{ formatted: 'Berlin, Germany' }]
  };

  const mockRouteResponse = {
    routes: [
      {
        legs: [
          {
            distance: { value: 1000 },
            duration: { value: 600 }
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeoapifyService]
    });
    service = TestBed.inject(GeoapifyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return coordinates for a location', () => {
    const location = 'Berlin';
    const expectedUrl = `${service['geocodeBaseUrl']}search?text=Berlin&format=json&apiKey=${environment.geoapifyKey}`;

    service.getCoordinates(location).subscribe(response => {
      expect(response).toEqual(mockCoordinatesResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockCoordinatesResponse);
  });

  it('should return address for coordinates', () => {
    const lat = 52.52;
    const lon = 13.405;
    const expectedUrl = `${service['geocodeBaseUrl']}reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${environment.geoapifyKey}`;

    service.getAddress(lat, lon).subscribe(response => {
      expect(response).toEqual(mockAddressResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockAddressResponse);
  });

  it('should return route for given coordinates and mode', () => {
    const start = { lat: 52.52, lon: 13.405 };
    const end = { lat: 48.8566, lon: 2.3522 };
    const mode = 'car';
    const expectedUrl = `${service['routeBaseUrl']}?waypoints=52.52,13.405|48.8566,2.3522&traffic=approximated&mode=${mode}&apiKey=${environment.geoapifyKey}`;

    service.getRoute(start, end, mode).subscribe(response => {
      expect(response).toEqual(mockRouteResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRouteResponse);
  });

  it('should handle error response for getCoordinates', () => {
    const location = 'Unknown Place';
    const expectedUrl = `${service['geocodeBaseUrl']}search?text=Unknown%20Place&format=json&apiKey=${environment.geoapifyKey}`;

    service.getCoordinates(location).subscribe(
      () => {},
      (error) => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', { status: 404, statusText: 'Not Found' });
  });

  it('should handle error response for getRoute', () => {
    const start = { lat: 52.52, lon: 13.405 };
    const end = { lat: 48.8566, lon: 2.3522 };
    const mode = 'car';
    const expectedUrl = `${service['routeBaseUrl']}?waypoints=52.52,13.405|48.8566,2.3522&traffic=approximated&mode=${mode}&apiKey=${environment.geoapifyKey}`;

    service.getRoute(start, end, mode).subscribe(
      () => {},
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
