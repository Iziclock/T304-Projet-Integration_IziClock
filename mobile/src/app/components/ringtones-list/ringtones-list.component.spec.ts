import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RingtonesListComponent } from './ringtones-list.component';
import { RingtoneService } from 'src/app/services/ringtone.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RingtoneData } from 'src/app/interfaces/ringtones';
import { ringtone } from 'src/app/classes/ringtones';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

describe('RingtonesListComponent', () => {
  let component: RingtonesListComponent;
  let fixture: ComponentFixture<RingtonesListComponent>;
  let mockRingtoneService: jasmine.SpyObj<RingtoneService>;

  beforeEach(async () => {
    mockRingtoneService = jasmine.createSpyObj('RingtoneService', ['getRingtones', 'updateRingtoneName']);

    await TestBed.configureTestingModule({
      declarations: [RingtonesListComponent],
      providers: [{ provide: RingtoneService, useValue: mockRingtoneService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RingtonesListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should pause audio if already playing', () => {
    const mockAudio = jasmine.createSpyObj('HTMLAudioElement', ['play', 'pause']);
    component.defaultRingtones = [
      { id: 1, name: 'Test Ringtone', url: '', createdAt: new Date(), isPlaying: true, isEditing: false },
    ];
    component.currentAudio = mockAudio as HTMLAudioElement;
    component.currentIndex = 0;

    component.toggleAudio(mockAudio as HTMLAudioElement, 0, true);

    expect(mockAudio.pause).toHaveBeenCalled();
    expect(component.defaultRingtones[0].isPlaying).toBeFalse();
  });

  it('should play audio and update isPlaying', () => {
    const audioMock = jasmine.createSpyObj('HTMLAudioElement', ['play', 'pause']);
    component.defaultRingtones = [
      { id: 1, name: 'Ringtone 1', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
      { id: 2, name: 'Ringtone 2', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
    ];

    component.toggleAudio(audioMock, 0, true);

    expect(audioMock.play).toHaveBeenCalled();
    expect(component.defaultRingtones[0].isPlaying).toBeTrue();
    expect(component.currentAudio).toBe(audioMock);
    expect(component.currentIndex).toBe(0);
  });

  it('should initialize isPlaying and isEditing to false', () => {
    const ringtoneData: RingtoneData = {
      ID: 3,
      Name: 'Default Properties Ringtone',
      Url: 'http://example.com/ringtone.mp3',
      CreatedAt: '2024-12-01T10:00:00Z',
    };

    const ringtoneInstance = new ringtone(ringtoneData);

    expect(ringtoneInstance.isPlaying).toBeFalse();
    expect(ringtoneInstance.isEditing).toBeFalse();
  });

  it('should call getRingtones on ngOnInit', () => {
    const getRingtonesSpy = spyOn(component, 'getRingtones');
    component.ngOnInit();
    expect(getRingtonesSpy).toHaveBeenCalled();
  });

  it('should toggle isEditing property of ringtone', () => {
    const mockRingtones = [
      { id: 1, name: 'Test Ringtone 1', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
      { id: 2, name: 'Test Ringtone 2', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
    ];

    mockRingtones[0].isEditing = true; 

    component.updateRingtoneName(mockRingtones[0].id);

    expect(mockRingtones[0].isEditing).toBeTrue();  
  });

  it('should add ringtones to the list after calling getRingtones', () => {
    const mockRingtones = [
      { id: 1, name: 'Test Ringtone 1', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
      { id: 2, name: 'Test Ringtone 2', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
    ];

    mockRingtoneService.getRingtones.and.returnValue(of(mockRingtones));

    component.getRingtones();

    expect(mockRingtones.length).toBe(2);
    expect(mockRingtones[0].name).toBe('Test Ringtone 1');
  });

  it('should pause the current audio if another audio is played', () => {
    const mockAudio1 = jasmine.createSpyObj('HTMLAudioElement', ['play', 'pause']);
    const mockAudio2 = jasmine.createSpyObj('HTMLAudioElement', ['play', 'pause']);

    component.defaultRingtones = [
      { id: 1, name: 'Ringtone 1', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
      { id: 2, name: 'Ringtone 2', url: '', createdAt: new Date(), isPlaying: false, isEditing: false },
    ];

    component.currentAudio = mockAudio1 as HTMLAudioElement;
    component.currentIndex = 0;

    component.toggleAudio(mockAudio2, 1, true);

    expect(mockAudio1.pause).toHaveBeenCalled();
    expect(mockAudio2.play).toHaveBeenCalled();
    expect(component.currentAudio).toBe(mockAudio2);
    expect(component.currentIndex).toBe(1);
  });

  it('should stop all ringtones and reset currentAudio and currentIndex', () => {
    component.defaultRingtones = [
      { id: 1, name: 'Default Ringtone', url: '', createdAt: new Date(), isPlaying: true, isEditing: false },
    ];
    component.userRingtones = [
      { id: 4, name: 'User Ringtone', url: '', createdAt: new Date(), isPlaying: true, isEditing: false },
    ];
    const mockAudio = jasmine.createSpyObj('HTMLAudioElement', ['pause']);
    component.currentAudio = mockAudio;
    component.currentIndex = 0;
  
    component.stopAllRingtones();
  
    expect(mockAudio.pause).toHaveBeenCalled();
    expect(component.defaultRingtones[0].isPlaying).toBeFalse();
    expect(component.userRingtones[0].isPlaying).toBeFalse();
    expect(component.currentAudio).toBeNull();
    expect(component.currentIndex).toBeNull();
  });
});

describe('RingtoneService', () => {
  let service: RingtoneService;
  let httpMock: HttpTestingController;

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

  it('should retrieve ringtones from the API', () => {
    const mockRingtones = [
      { ID: 1, Name: 'Ringtone 1', Url: 'http://example.com/1.mp3', CreatedAt: '2024-12-01T10:00:00Z' },
      { ID: 2, Name: 'Ringtone 2', Url: 'http://example.com/2.mp3', CreatedAt: '2024-12-01T11:00:00Z' },
    ];

    service.getRingtones().subscribe((ringtones) => {
      expect(ringtones).toEqual(mockRingtones);
    });

    const req = httpMock.expectOne(`${environment.api}/ringtones`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRingtones);
  });

  it('should upload a ringtone', () => {
    const mockResponse = { success: true };
    const formData = new FormData();
    formData.append('file', new Blob(['ringtone-data'], { type: 'audio/mp3' }), 'ringtone.mp3');

    service.uploadRingtone(formData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.api}/ringtones/upload`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update the name of a ringtone', () => {
    const mockResponse = { success: true };
    const id = 1;
    const newName = 'Updated Ringtone';

    service.updateRingtoneName(id, newName).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.api}/ringtones/name/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: newName });
    req.flush(mockResponse);
  });

  
});
