import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElitePromotionComponent } from './elite-promotion.component';

describe('ElitePromotionComponent', () => {
  let component: ElitePromotionComponent;
  let fixture: ComponentFixture<ElitePromotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElitePromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElitePromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
