import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyeventsPage } from './myevents.page';

describe('MyeventsPage', () => {
  let component: MyeventsPage;
  let fixture: ComponentFixture<MyeventsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyeventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
