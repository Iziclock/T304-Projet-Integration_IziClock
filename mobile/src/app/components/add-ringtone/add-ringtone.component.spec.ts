import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRingtoneComponent } from './add-ringtone.component';
import { RingtoneService } from 'src/app/services/ringtone.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('AddRingtoneComponent', () => {
  let component: AddRingtoneComponent;
  let fixture: ComponentFixture<AddRingtoneComponent>;
  let mockRingtoneService: jasmine.SpyObj<RingtoneService>;

  beforeEach(async () => {
    mockRingtoneService = jasmine.createSpyObj('RingtoneService', ['uploadRingtone']);

    await TestBed.configureTestingModule({
      declarations: [AddRingtoneComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: RingtoneService, useValue: mockRingtoneService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddRingtoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onFileSelected', () => {
    it('should set selectedFile and selectedFileName when a valid audio file is selected', () => {
      const mockFile = new File([''], 'test-audio.mp3', { type: 'audio/mp3' });
      const event = { target: { files: [mockFile] } };

      component.onFileSelected(event);

      expect(component.selectedFile).toEqual(mockFile);
      expect(component.selectedFileName).toBe('test-audio.mp3');
      expect(component.uploadMessage).toBe('');
      expect(component.messageType).toBe('');
    });

    it('should set an error message when a non-audio file is selected', () => {
      const mockFile = new File([''], 'test-file.txt', { type: 'text/plain' });
      const event = { target: { files: [mockFile] } };

      component.onFileSelected(event);

      expect(component.selectedFile).toBeNull();
      expect(component.selectedFileName).toBe('');
      expect(component.uploadMessage).toBe('Veuillez sélectionner un fichier audio');
      expect(component.messageType).toBe('error');
    });
  });

  describe('uploadRingtone', () => {
    it('should call the service to upload a ringtone and display a success message on success', () => {
      const mockFile = new File([''], 'test-audio.mp3', { type: 'audio/mp3' });
      const mockResponse = { success: true };
      component.selectedFile = mockFile;

      mockRingtoneService.uploadRingtone.and.returnValue(of(mockResponse));

      component.uploadRingtone();

      expect(mockRingtoneService.uploadRingtone).toHaveBeenCalled();
      expect(mockRingtoneService.uploadRingtone).toHaveBeenCalledWith(jasmine.any(FormData));
      expect(component.uploadMessage).toBe('Sonnerie correctement ajoutée');
      expect(component.messageType).toBe('success');
      expect(component.isLoading).toBeFalse();
    });

    it('should display an error message if the service returns an error with status 409', () => {
      const mockFile = new File([''], 'test-audio.mp3', { type: 'audio/mp3' });
      const mockError = { status: 409 };
      component.selectedFile = mockFile;

      mockRingtoneService.uploadRingtone.and.returnValue(throwError(mockError));

      component.uploadRingtone();

      expect(mockRingtoneService.uploadRingtone).toHaveBeenCalled();
      expect(component.uploadMessage).toBe('Erreur : cette sonnerie a déjà été ajoutée');
      expect(component.messageType).toBe('error');
      expect(component.isLoading).toBeFalse();
    });

    it('should display a generic error message if the service returns an error with a different status', () => {
      const mockFile = new File([''], 'test-audio.mp3', { type: 'audio/mp3' });
      const mockError = { status: 500 };
      component.selectedFile = mockFile;

      mockRingtoneService.uploadRingtone.and.returnValue(throwError(mockError));

      component.uploadRingtone();

      expect(mockRingtoneService.uploadRingtone).toHaveBeenCalled();
      expect(component.uploadMessage).toBe('Erreur lors de l\'ajout de la sonnerie');
      expect(component.messageType).toBe('error');
      expect(component.isLoading).toBeFalse();
    });

    it('should display an error message if no file is selected', () => {
      component.selectedFile = null;

      component.uploadRingtone();

      expect(mockRingtoneService.uploadRingtone).not.toHaveBeenCalled();
      expect(component.uploadMessage).toBe('Aucun fichier sélectionné');
      expect(component.messageType).toBe('error');
    });
  });
});

describe('RingtoneService', () => {
  let service: RingtoneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RingtoneService]
    });

    service = TestBed.inject(RingtoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  describe('getRingtones', () => {
    it('should retrieve ringtones', () => {
      const mockRingtones = [
        { id: 1, name: 'Ringtone 1' },
        { id: 2, name: 'Ringtone 2' }
      ];

      service.getRingtones().subscribe((ringtones) => {
        expect(ringtones).toEqual(mockRingtones);
      });

      const req = httpMock.expectOne(`${environment.api}/ringtones`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRingtones); 
    });

    it('should handle error response', () => {
      const errorMessage = 'Unable to fetch ringtones';

      service.getRingtones().subscribe(
        () => fail('Expected an error, not ringtones'),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      );

      const req = httpMock.expectOne(`${environment.api}/ringtones`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('uploadRingtone', () => {
    it('should upload a ringtone successfully', () => {
      const formData = new FormData();
      const mockResponse = { success: true };

      service.uploadRingtone(formData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.api}/ringtones/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formData); 
      req.flush(mockResponse); 
    });

    it('should handle error response on upload', () => {
      const formData = new FormData();
      const errorMessage = 'Error uploading ringtone';

      service.uploadRingtone(formData).subscribe(
        () => fail('Expected an error, not success'),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      );

      const req = httpMock.expectOne(`${environment.api}/ringtones/upload`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('updateRingtoneName', () => {
    it('should update the ringtone name successfully', () => {
      const mockId = 1;
      const mockName = 'Updated Ringtone Name';
      const mockResponse = { id: mockId, name: mockName };

      service.updateRingtoneName(mockId, mockName).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.api}/ringtones/name/${mockId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ name: mockName });
      req.flush(mockResponse); 
    });

    it('should handle error response on update', () => {
      const mockId = 1;
      const mockName = 'Updated Ringtone Name';
      const errorMessage = 'Error updating ringtone name';

      service.updateRingtoneName(mockId, mockName).subscribe(
        () => fail('Expected an error, not success'),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      );

      const req = httpMock.expectOne(`${environment.api}/ringtones/name/${mockId}`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
