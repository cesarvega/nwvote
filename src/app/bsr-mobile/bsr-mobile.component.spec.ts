import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsrMobileComponent } from './bsr-mobile.component';

describe('BsrMobileComponent', () => {
  let component: BsrMobileComponent;
  let fixture: ComponentFixture<BsrMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsrMobileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsrMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
