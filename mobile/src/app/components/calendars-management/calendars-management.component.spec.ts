import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarsManagementComponent } from './calendars-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CalendarsManagementComponent', () => {
  let component: CalendarsManagementComponent;
  let fixture: ComponentFixture<CalendarsManagementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarsManagementComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
