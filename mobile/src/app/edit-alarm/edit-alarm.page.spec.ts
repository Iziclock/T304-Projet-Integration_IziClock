import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAlarmePage } from './edit-alarm.page';

describe('EditAlarmePage', () => {
  let component: EditAlarmePage;
  let fixture: ComponentFixture<EditAlarmePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAlarmePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
