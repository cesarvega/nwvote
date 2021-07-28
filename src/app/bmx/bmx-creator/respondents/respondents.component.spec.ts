import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondentsComponent } from './respondents.component';

describe('RespondentsComponent', () => {
  let component: RespondentsComponent;
  let fixture: ComponentFixture<RespondentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespondentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespondentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
