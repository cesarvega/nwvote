import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';
import QRCodeStyling from "qr-code-styling";

@Component({
  selector: 'app-elite-qr-code-designer',
  templateUrl: './elite-qr-code-designer.component.html',
  styleUrls: ['./elite-qr-code-designer.component.scss']
})
export class EliteQrCodeDesignerComponent implements OnInit {


  title = 'ELITE'
  VenueName = '';
  VenueEmail = '';
  VenuePayment = '';
  VenueBalance = '';
  VenuePhone = '';

  declare navigator: any;
  newVariable: any = window.navigator;

  DASH = []



  myAngularxQrCode = 'http://mrvrman.com/elitecesar';
  // myAngularxQrCode = 'http://mrvrman.com/elite';

  foodOptions: any;
  foodToppings: any;

  popUpToppings = false;
  popUpOptions = false;
  popUpCheckout = false;
  popUpQRCode = false;
  popUpThankyou = false;
  popUpReview = false;
  foodTopping;
  foodOption;
  sendingOrder: any;
  selectedOption;
  paramsArray: any; email: any;
  tableNo: any;

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  @ViewChild("canvas", { static: true }) canvas: ElementRef;

  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.tableNo = +params['id'];
    });

    console.log(QRCodeStyling);
    if (!QRCodeStyling) {
      return;
    }

    let qrCodeColotThemes = {
      dotsOptions : { type: "dots", color: "#9d64a1", gradient: {
        type: 'linear', rotation: 0, colorStops: [{
          offset: 0,
          color: "#9d64a1"
        }, {
          offset: 3,
          color: "#decddf"
        }]
      } },
      backgroundOptions :{
        type: "square", color: "#fff", gradient: {
          type: 'radial', rotation: 0, colorStops: [{
            offset: 0,
            color: "#fff"
          }]
        }
      },
      cornersDotOptions :{
        type: "dot", color: "#fff", gradient: {
          type: 'linear', rotation: 0, colorStops: [{
            offset: 0,
            color: "#fff"
          }, {
            offset: 3,
            color: "#fff"
          }]
        }
      }
    }

    const qrCode = new QRCodeStyling({
      width: 223, height: 223, data: this.myAngularxQrCode, margin: 0,
      qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
      dotsOptions: { type: "dots", color: "#9d64a1", gradient: {
        type: 'linear', rotation: 0, colorStops: [{
          offset: 0,
          color: "#9d64a1"
        }, {
          offset: 3,
          color: "#decddf"
        }]
      } },
      backgroundOptions: { color: "#000000" },
      image: "./assets/img/elite/logow.png",
      cornersSquareOptions: {
        type: "square", color: "#fff", gradient: {
          type: 'radial', rotation: 0, colorStops: [{
            offset: 0,
            color: "#fff"
          }]
        }
      },
      cornersDotOptions: {
        type: "dot", color: "#fff", gradient: {
          type: 'linear', rotation: 0, colorStops: [{
            offset: 0,
            color: "#fff"
          }, {
            offset: 3,
            color: "#fff"
          }]
        }
      }
    });

    qrCode.append(this.canvas.nativeElement);
  }

  crypto() {
    window.open('https://commerce.coinbase.com/checkout/d983d382-1345-4214-9518-fb7d3ca97b27', "_top");
  }

  toppings(index) {
    this.popUpToppings = true;
    // this.foodToppings = this.food[index];
  }

  dismissErrorForm() {
    this.popUpToppings = false;
    this.popUpOptions = false;
    this.popUpCheckout = false;
    this.popUpQRCode = false;
  }

  qrcode() {
    this.popUpQRCode = !this.popUpQRCode;

  }

  isVenueInfoReady() {

  }

}
