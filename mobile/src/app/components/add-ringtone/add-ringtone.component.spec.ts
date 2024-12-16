import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRingtoneComponent } from './add-ringtone.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddRingtoneComponent', () => {
  let component: AddRingtoneComponent;
  let fixture: ComponentFixture<AddRingtoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRingtoneComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRingtoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
