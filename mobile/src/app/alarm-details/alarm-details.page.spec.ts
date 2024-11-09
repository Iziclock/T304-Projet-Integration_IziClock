import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmDetailsPage } from './alarm-details.page';
import { ActivatedRoute } from '@angular/router';

describe('AlarmDetailsPage', () => {
  let component: AlarmDetailsPage;
  let fixture: ComponentFixture<AlarmDetailsPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlarmDetailsPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (paramName: string) => 'paramValue'
              }
            }
          }
        }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(AlarmDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
