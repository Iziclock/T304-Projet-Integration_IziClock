import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultRingtonesComponent } from './default-ringtones.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DefaultRingtonesComponent', () => {
  let component: DefaultRingtonesComponent;
  let fixture: ComponentFixture<DefaultRingtonesComponent>;
  let audioMock: jasmine.SpyObj<HTMLAudioElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultRingtonesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ], 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultRingtonesComponent);
    component = fixture.componentInstance;

    audioMock = jasmine.createSpyObj('HTMLAudioElement', ['play', 'pause']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle audio play/pause correctly', () => {
    expect(component.defaultRingtones[0].isPlaying).toBe(false);

    component.toggleAudio(audioMock, 0);

    expect(audioMock.play).toHaveBeenCalled();
    expect(component.defaultRingtones[0].isPlaying).toBe(true);

    component.toggleAudio(audioMock, 0);

    expect(audioMock.pause).toHaveBeenCalled();
    expect(component.defaultRingtones[0].isPlaying).toBe(false);
  });

  it('should pause the previous audio and play the new one', () => {
    component.toggleAudio(audioMock, 0);
    expect(audioMock.play).toHaveBeenCalled();
    
    const audioMock2 = jasmine.createSpyObj('HTMLAudioElement', ['play', 'pause']);
    component.toggleAudio(audioMock2, 1);

    expect(audioMock.pause).toHaveBeenCalled();

    expect(audioMock2.play).toHaveBeenCalled();
    expect(component.defaultRingtones[1].isPlaying).toBe(true);
    expect(component.defaultRingtones[0].isPlaying).toBe(false);
  });
});
