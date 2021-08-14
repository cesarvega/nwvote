import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteCorporateComponent } from './elite-corporate.component';

describe('EliteCorporateComponent', () => {
  let component: EliteCorporateComponent;
  let fixture: ComponentFixture<EliteCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
