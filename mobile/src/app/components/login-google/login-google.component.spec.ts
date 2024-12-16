import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginGoogleComponent } from './login-google.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginGoogleComponent', () => {
  let component: LoginGoogleComponent;
  let fixture: ComponentFixture<LoginGoogleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginGoogleComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
