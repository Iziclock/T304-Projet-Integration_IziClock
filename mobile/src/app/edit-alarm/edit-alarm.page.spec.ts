import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAlarmPage } from './edit-alarm.page';

describe('EditAlarmPage', () => {
  let component: EditAlarmPage;
  let fixture: ComponentFixture<EditAlarmPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAlarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
