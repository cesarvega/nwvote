import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteQrCodeDesignerComponent } from './elite-qr-code-designer.component';

describe('EliteQrCodeDesignerComponent', () => {
  let component: EliteQrCodeDesignerComponent;
  let fixture: ComponentFixture<EliteQrCodeDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteQrCodeDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteQrCodeDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
