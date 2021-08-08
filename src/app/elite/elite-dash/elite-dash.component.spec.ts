import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteDashComponent } from './elite-dash.component';

describe('EliteDashComponent', () => {
  let component: EliteDashComponent;
  let fixture: ComponentFixture<EliteDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
