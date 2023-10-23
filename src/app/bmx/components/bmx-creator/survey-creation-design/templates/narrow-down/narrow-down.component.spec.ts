import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrowDownComponent } from './narrow-down.component';

describe('NarrowDownComponent', () => {
  let component: NarrowDownComponent;
  let fixture: ComponentFixture<NarrowDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NarrowDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NarrowDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
