import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListMasterPage } from './list-master.page';

describe('ListMasterPage', () => {
  let component: ListMasterPage;
  let fixture: ComponentFixture<ListMasterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListMasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
