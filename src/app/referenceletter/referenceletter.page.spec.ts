import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferenceletterPage } from './referenceletter.page';

describe('ReferenceletterPage', () => {
  let component: ReferenceletterPage;
  let fixture: ComponentFixture<ReferenceletterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReferenceletterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
