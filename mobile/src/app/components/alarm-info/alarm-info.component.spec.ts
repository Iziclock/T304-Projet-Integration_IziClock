import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AlarmInfoComponent } from './alarm-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RingdatePipe } from 'src/app/pipes/ringdate.pipe';

describe('AlarmInfoComponent', () => {
  let component: AlarmInfoComponent;
  let fixture: ComponentFixture<AlarmInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmInfoComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, RingdatePipe]
    }).compileComponents();

    fixture = TestBed.createComponent(AlarmInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
