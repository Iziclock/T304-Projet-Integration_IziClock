import { TestBed } from '@angular/core/testing';

import { RingtoneService } from './ringtone.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RingtoneService', () => {
  let service: RingtoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] 
    });
    service = TestBed.inject(RingtoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
