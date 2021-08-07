import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElitePromoterComponent } from './elite-promoter.component';

describe('ElitePromoterComponent', () => {
  let component: ElitePromoterComponent;
  let fixture: ComponentFixture<ElitePromoterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElitePromoterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElitePromoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
