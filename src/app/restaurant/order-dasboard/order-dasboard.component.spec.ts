import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDasboardComponent } from './order-dasboard.component';

describe('OrderDasboardComponent', () => {
  let component: OrderDasboardComponent;
  let fixture: ComponentFixture<OrderDasboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDasboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDasboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
