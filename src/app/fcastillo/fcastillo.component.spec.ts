import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcastilloComponent } from './fcastillo.component';

describe('FcastilloComponent', () => {
  let component: FcastilloComponent;
  let fixture: ComponentFixture<FcastilloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcastilloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcastilloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
