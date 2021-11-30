import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinderComponent } from './tinder.component';

describe('TinderComponent', () => {
  let component: TinderComponent;
  let fixture: ComponentFixture<TinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
