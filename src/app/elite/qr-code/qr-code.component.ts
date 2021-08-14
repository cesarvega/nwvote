import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';
import QRCodeStyling from "qr-code-styling";

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {



  title = 'ELITE'
  VenueName = '';
  VenueEmail = '';
  VenuePayment = '';
  VenueBalance = '';
  VenuePhone = '';
  popUpQRCode = false;
 
  @Input() qrCodeConfig: any;

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  @ViewChild("canvas", { static: true }) canvas: ElementRef;

  
  dotsOptions

  ngOnInit(): void {
    console.log(QRCodeStyling);
    if (!QRCodeStyling) {
      return;
    }

    this.dotsOptions = this.qrCodeConfig.qrCodeConfig
    const qrCode = new QRCodeStyling({
      width: 223, height: 223, data: this.dotsOptions.qrCodeRenderUrl, margin: 0,
      qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
      dotsOptions: {
        type: "dots", color: this.dotsOptions.color, gradient: {
          type: 'linear', rotation: 0, colorStops: [{
            offset: 0,
            color: this.dotsOptions.color1
          }, {
            offset: 5,
            color: this.dotsOptions.color2
          }]
        }
      },
      backgroundOptions: { color: this.dotsOptions.background },
      image: this.dotsOptions.logo,
      cornersSquareOptions: {
        type: "square", color: "#fff", gradient: {
          type: 'radial', rotation: 0, colorStops: [{
            offset: 0,
            color: this.dotsOptions.cornersSquare
          }]
        }
      },
      cornersDotOptions: {
        type: "dot", color: this.dotsOptions.cornersSquare, gradient: {
          type: 'linear', rotation: 0, colorStops: [{
            offset: 0,
            color: this.dotsOptions.cornersSquare
          }, {
            offset: 5,
            color: this.dotsOptions.cornersSquare
          }]
        }
      }
    });

    qrCode.append(this.canvas.nativeElement);
  }

  dismissErrorForm() {
    this.popUpQRCode = false;
  }
  qrcode() {
    this.popUpQRCode = !this.popUpQRCode;

  }

}
