import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrCodePopupComponentComponent } from './qr-code-popup-component.component';

QrCodePopupComponentComponent
describe('QrCodePopupComponentComponent', () => {
  let component: QrCodePopupComponentComponent;
  let fixture: ComponentFixture<QrCodePopupComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrCodePopupComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrCodePopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
