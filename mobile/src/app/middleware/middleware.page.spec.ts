import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiddlewarePage } from './middleware.page';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

describe('MiddlewarePage', () => {
  let fixture: ComponentFixture<MiddlewarePage>;
  let component: MiddlewarePage;
  let mockRouter: any;
  let mockAuthService: any;

  const createTestBed = (queryParamMapMock: any) => {
    // Mock du service AuthService
    mockAuthService = {
      retrieveTokenLazy: jasmine.createSpy('retrieveTokenLazy').and.returnValue('mockToken')
    };

    // Mock du service Router
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    TestBed.configureTestingModule({
      declarations: [MiddlewarePage],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: queryParamMapMock
            }
          }
        },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MiddlewarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    createTestBed({
      get: (key: string) => (key === 'code' ? 'mockCode' : null)
    });
    expect(component).toBeTruthy();
  });

  it('should retrieve token and navigate when code exists', () => {
    createTestBed({
      get: (key: string) => (key === 'code' ? 'mockCode' : null)
    });

    expect(mockAuthService.retrieveTokenLazy).toHaveBeenCalledWith('mockCode');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/calendars']);
  });

  it('should not navigate when code does not exist', () => {
    createTestBed({
      get: () => null // Simule l'absence de code
    });

    expect(mockAuthService.retrieveTokenLazy).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
