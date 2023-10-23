import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmxComponent } from './bmx.component';

describe('BmxComponent', () => {
  let component: BmxComponent;
  let fixture: ComponentFixture<BmxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
