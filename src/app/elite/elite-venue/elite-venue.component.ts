import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';
import  QRCodeStyling  from "qr-code-styling";

@Component({
  selector: 'app-elite-venue',
  templateUrl: './elite-venue.component.html',
  styleUrls: ['./elite-venue.component.scss']
})
export class EliteVenueComponent implements OnInit {


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
    console.log(QRCodeStyling);
    if (!QRCodeStyling) {
      return;
    }
    const qrCode = new QRCodeStyling({
      width: 232,
      height: 232,
      margin: 14,
      data: "https://www.facebook.com/",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
      dotsOptions: {
        color: "#4267b2",
        type: "rounded"
      },
      backgroundOptions: {
        color: "#e9ebee"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 14
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

  isVenueInfoReady(){

  }

}
