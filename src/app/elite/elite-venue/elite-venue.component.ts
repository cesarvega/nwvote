import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';

@Component({
  selector: 'app-elite-venue',
  templateUrl: './elite-venue.component.html',
  styleUrls: ['./elite-venue.component.scss']
})
export class EliteVenueComponent implements OnInit {



  title = 'ELITE'
  VenueName = 'Baoli';
  VenueEmail = 'baouli@gmail.com';
  VenuePayment = 'zelle';
  VenueBalance = '0';
  VenuePhone = '3055558899';
  VenueAddress = '201 South Beach, Fl, 33130';
  VenueType = 'restaurant';
  popUpQRCode: boolean;
  venueId: any;
  emailregistered = false;

  venueInfo = {
    VenueName: this.VenueName,
    VenueEmail: this.VenueEmail,
    VenuePayment: this.VenuePayment,
    VenueBalance: this.VenueBalance,
    VenuePhone: this.VenuePhone,
    VenueAddress: this.VenueAddress,
    VenueType: this.VenueType,
    updated: new Date(),
    created: new Date()
  }

  constructor(private paramsRouter: ActivatedRoute, private EliteService: EliteService) { }

  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.venueId = params['id'];
    });

    this.venueId = localStorage.getItem('venueId');
    if (this.venueId) {
      this.EliteService.getVenueById(this.venueId).subscribe((arg: any) => {
        if (arg.payload.data()) {
          this.venueInfo = arg.payload.data()
        }
      });
    }
  }

  qrcode() {
    this.popUpQRCode = !this.popUpQRCode;
  }

  reset() {
    this.venueInfo = {
      VenueName: '',
      VenueEmail: '',
      VenuePayment: '',
      VenueBalance: '',
      VenuePhone: '',
      VenueAddress: '',
      VenueType: '',
      updated: new Date(),
      created: new Date()
    }
  }

  resetEmailError() {
    this.emailregistered = false
  }

  createOrUpdateVenue() {
    this.EliteService.getVenueById(this.VenueEmail).subscribe((arg: any) => {
      if (arg.payload.exists) {
        console.log('this venue is already registered')
        this.emailregistered = true
      } else {
        this.venueInfo = {
          VenueName: this.VenueName,
          VenueEmail: this.VenueEmail,
          VenuePayment: this.VenuePayment,
          VenueBalance: this.VenueBalance,
          VenuePhone: this.VenuePhone,
          VenueAddress: this.VenueAddress,
          VenueType: this.VenueType,
          updated: new Date(),
          created: new Date()
        }
        this.EliteService.createVenue(this.venueInfo).then(res => {
          localStorage.setItem('venueId', this.VenueEmail)
        })
      }
    });
  }
}
