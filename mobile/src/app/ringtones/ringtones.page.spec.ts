import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RingtonesPage } from './ringtones.page';

describe('RingtonesPage', () => {
  let component: RingtonesPage;
  let fixture: ComponentFixture<RingtonesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RingtonesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
