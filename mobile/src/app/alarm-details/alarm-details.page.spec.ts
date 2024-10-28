import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmDetailsPage } from './alarm-details.page';

describe('AlarmDetailsPage', () => {
  let component: AlarmDetailsPage;
  let fixture: ComponentFixture<AlarmDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
