import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLineBreakComponent } from './page-line-break.component';

describe('PageLineBreakComponent', () => {
  let component: PageLineBreakComponent;
  let fixture: ComponentFixture<PageLineBreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLineBreakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLineBreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
