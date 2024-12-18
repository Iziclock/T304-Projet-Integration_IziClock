import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RingtoneService } from './ringtone.service';
import { environment } from 'src/environments/environment';

describe('RingtoneService', () => {
  let service: RingtoneService;
  let httpMock: HttpTestingController;

  const mockRingtones = [
    { id: 1, name: 'Real Gone', src: '/assets/ringtones/real-gone.mp3' },
    { id: 2, name: 'Kalash', src: '/assets/ringtones/kalash.mp3' }
  ];

  const mockFormData = new FormData();
  mockFormData.append('file', new Blob(), 'mock-file.mp3');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RingtoneService],
    });
    service = TestBed.inject(RingtoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch ringtones', () => {
    service.getRingtones().subscribe(ringtones => {
      expect(ringtones).toEqual(mockRingtones);
    });

    const req = httpMock.expectOne(`${environment.api}/ringtones`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRingtones);
  });

  it('should upload ringtone', () => {
    service.uploadRingtone(mockFormData).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.api}/ringtones/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockFormData);
    req.flush({ success: true });
  });

  it('should update ringtone name', () => {
    const id = 1;
    const name = 'Updated Name';

    service.updateRingtoneName(id, name).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${environment.api}/ringtones/name/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name });
    req.flush({ success: true });
  });
});
