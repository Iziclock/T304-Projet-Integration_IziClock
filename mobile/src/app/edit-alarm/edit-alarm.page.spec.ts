import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAlarmePage } from './edit-alarm.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('EditAlarmePage', () => {
  let component: EditAlarmePage;
  let fixture: ComponentFixture<EditAlarmePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAlarmePage],
      imports: [HttpClientTestingModule],
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

    fixture = TestBed.createComponent(EditAlarmePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
