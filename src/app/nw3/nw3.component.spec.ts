import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NW3Component } from './nw3.component';

describe('NW3Component', () => {
  let component: NW3Component;
  let fixture: ComponentFixture<NW3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NW3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NW3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
