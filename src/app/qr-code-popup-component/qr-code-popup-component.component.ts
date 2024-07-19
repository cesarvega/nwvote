import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code-popup-component',
  standalone: true,
  imports: [],
  templateUrl: './qr-code-popup-component.component.html',
  styleUrl: './qr-code-popup-component.component.scss'
})
export class QrCodePopupComponentComponent {
  @Input() url: string = '';
    qrCodeImage: string = '';
    @Output() closePopup = new EventEmitter<void>();
    constructor() { }

    ngOnInit(): void {
        QRCode.toDataURL(this.url)
            .then((url: string) => {
                this.qrCodeImage = url;
            })
            .catch((err: any) => {
                console.error(err);
            });
    }
    close() {
      this.closePopup.emit();
    }

    onBackdropClick(event: MouseEvent) {
        this.close();
    }

    onPopupClick(event: MouseEvent) {
        // Prevents the click on the popup from closing it
        // event.stopPropagation();
        this.closePopup.emit();
    }
}
