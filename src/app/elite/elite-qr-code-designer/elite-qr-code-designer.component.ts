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



  myAngularxQrCode = 'http://mrvrman.com/eliteCesar';
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

  // ngOnInit(): void {

  //   this.paramsRouter.params.subscribe(params => {
  //     this.tableNo = +params['id'];
  //   });

  //   this.EliteService.getAllPromoters()
  //     .subscribe((arg: any) => {
  //       this.DASH = arg;
  //     });
  // }
  @ViewChild("canvas", { static: true }) canvas: ElementRef;

  ngOnInit(): void {



    this.paramsRouter.params.subscribe(params => {
      this.tableNo = +params['id'];
    });


    console.log(QRCodeStyling);
    if (!QRCodeStyling) {
      return;
    }
    const qrCode = new QRCodeStyling({
      width: 300, height: 300, data: "https://qr-code-styling.com", margin: 2,
      qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
      dotsOptions: { type: "dots", color: "#6a1a4c" },
      backgroundOptions: { color: "#ffffff" },
      image: "./assets/img/elite/logo.png",
      cornersSquareOptions: {
        type: "extra-rounded", color: "#000000", gradient: {
          type: 'radial', rotation: 0, colorStops: [{
            offset: 0,
            color: "#cc0000"
          }]
        }
      },
      cornersDotOptions: {
        type: "square", color: "#000000", gradient: {
          type: 'linear', rotation: 0, colorStops: [{
            offset: 0,
            color: "#cc0000"
          }, {
            offset: 3,
            color: "#0000ff"
          }]
        }
      }
    });


    // dotsOptionsHelper:{
    //   colorType:{single:true,gradient:false},
    //   gradient:{linear:true,radial:false,color1:"#6a1a4c",color2:"#6a1a4c",rotation:0}},
    //   cornersSquareOptions:{type:"extra-rounded",color:"#000000"},
    //   cornersSquareOptionsHelper:{colorType:{single:true,gradient:false},gradient:{linear:true,radial:false,color1:"#000000",
    //   color2:"#000000",rotation:0}},
    //   cornersDotOptions:{type:"square",color:"#000000"},cornersDotOptionsHelper:{colorType:{singlex:true,
    //     gradient:false},gradient:{linear:true,radial:false,color1:"#000000",color2:"#000000",rotation:0}},
    //     backgroundOptionsHelper:{colorType:{single:true,gradient:false},gradient:{linear:true,radial:false,
    //       color1:"#ffffff",color2:"#ffffff",rotation:0}}

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
