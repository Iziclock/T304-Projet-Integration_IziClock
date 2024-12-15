import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RingtonesListComponent } from './ringtones-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RingtonesListComponent', () => {
  let component: RingtonesListComponent;
  let fixture: ComponentFixture<RingtonesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RingtonesListComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RingtonesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
