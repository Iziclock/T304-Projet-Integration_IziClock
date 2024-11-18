import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiddlewarePage } from './middleware.page';

describe('MiddlewarePage', () => {
  let component: MiddlewarePage;
  let fixture: ComponentFixture<MiddlewarePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiddlewarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
