import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfMenuPage } from './conf-menu.page';

describe('ConfMenuPage', () => {
  let component: ConfMenuPage;
  let fixture: ComponentFixture<ConfMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
