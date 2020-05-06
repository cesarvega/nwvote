import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsrComponent } from './bsr.component';

describe('BsrComponent', () => {
  let component: BsrComponent;
  let fixture: ComponentFixture<BsrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
