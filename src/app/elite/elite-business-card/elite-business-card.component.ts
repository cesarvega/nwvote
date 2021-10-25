import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { EliteAuthService } from '../elite-auth/elite-auth.service';
import QRCodeStyling from 'qr-code-styling';
@Component({
  selector: 'app-elite-business-card',
  templateUrl: './elite-business-card.component.html',
  styleUrls: ['./elite-business-card.component.scss']
})
export class EliteBusinessCardComponent implements OnInit, AfterViewInit {
  isGoVoteOn = true;
  isRadialMenuOn = false;
  isSettingsOn = false;
  faInstagram = faInstagram
  myAngularxQrCode = 'https://mrvrman.web.app/business-card';
  promoterId: any;
  qrcodeType: any;
  VenueId: any;
  fileToPlay: any;
  mute: any;
  audiofile: string;
  soundVolume = 0;
  themeIndex = 5;
  userIndex = 0;

  user = [{
    logoInitial: 'C',
    username: 'Cesar Vega',
    userDescription: '',
    title: 'Elite'
  }]

  theme = [
    {
      themeName: 'elite-pink',
      header: './assets/img/elite/CesarVega/header.jpg',
      body: './assets/img/elite/CesarVega/bodyLove.jpg',
      footer: './assets/img/elite/CesarVega/footer.jpg',
      fontFamily: '',
      fontSize: '10px'
    },
    {
      themeName: 'aqua',
      header: './assets/img/elite/CesarVega/headerMermaid.jpg',
      body: './assets/img/elite/CesarVega/bodYMermaid1.jpg',
      footer: './assets/img/elite/CesarVega/footerMermaid.jpg',
      fontFamily: '',
      fontSize: '10px'
    },
    {
      themeName: 'elite',
      header: './assets/img/elite/CesarVega/header.jpg',
      body: './assets/img/elite/CesarVega/bodyGreen.jpg',
      footer: './assets/img/elite/CesarVega/footer.jpg',
      fontFamily: '',
      fontSize: '10px'
    },
    {
      themeName: 'elite',
      header: './assets/img/elite/CesarVega/header.jpg',
      body: './assets/img/elite/CesarVega/bodyRose1.jpg',
      footer: './assets/img/elite/CesarVega/footer.jpg',
      fontFamily: '',
      fontSize: '10px'
    },

    {
      themeName: 'elite',
      header: './assets/img/elite/CesarVega/header.jpg',
      body: './assets/img/elite/CesarVega/bodyRose.jpg',
      footer: './assets/img/elite/CesarVega/footer.jpg',
      fontFamily: '',
      fontSize: '10px'
    },
    {
      themeName: 'elite',
      header: './assets/img/elite/CesarVega/header.jpg',
      body: './assets/img/elite/CesarVega/body.jpg',
      footer: './assets/img/elite/CesarVega/footer.jpg',
      fontFamily: '',
      fontSize: '10px'
    },
    {
      themeName: 'elite',
      header: './assets/img/elite/CesarVega/header.jpg',
      body: './assets/img/elite/CesarVega/bodyLV.jpg',
      footer: './assets/img/elite/CesarVega/footer.jpg',
      fontFamily: '',
      fontSize: '10px'
    },
   
  ]
 
  qrCode: QRCodeStyling;
  @ViewChild("canvas", { static: true }) canvas: ElementRef;
  constructor(private paramsRouter: ActivatedRoute,public auth : EliteAuthService) {
   
   }

  ngOnInit(): void {
    this.paramsRouter.params.subscribe(params => {
      this.promoterId = params['id'];
      this.qrcodeType = params['type'];
      this.VenueId = params['venueId'];
    });
    this.qrCode = new QRCodeStyling({
      width: 223,
      height: 223,
      data: this.myAngularxQrCode,
      margin: 0,
      qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 0 },
      dotsOptions: {
        type: 'dots',
        color: '#1023da',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            {
              offset: 0,
              color: '#1023da',
            },
            {
              offset: 3,
              color: '#8831da',
            },
          ],
        },
      },
      backgroundOptions: { color: '#fff' },
      image: './assets/img/elite/logo.png',
      cornersSquareOptions: {
        type: 'square',
        color: '#000',
        gradient: {
          type: 'radial',
          rotation: 45,
          colorStops: [
            {
              offset: 0,
              color: '#000',
            },
          ],
        },
      },
      cornersDotOptions: {
        type: 'dot',
        color: '#000',
        gradient: {
          type: 'linear',
          rotation: 45,
          colorStops: [
            {
              offset: 0,
              color: '#000',
            },
            {
              offset: 3,
              color: '#000',
            },
          ],
        },
      },
    });
    this.qrCode.append(this.canvas.nativeElement);
    setTimeout(() => {
      this.goVote()
    
    }, 4000);
 

  }

  ngAfterViewInit(): void {


  }

  changeTheme() {
    if (this.themeIndex == 0) {

      this.themeIndex = 1;
    } 
    else if (this.themeIndex == 1) {

      this.themeIndex = 2;
    } 
    else if (this.themeIndex == 2)  {
      this.themeIndex = 3;
    }
    else if (this.themeIndex == 3)  {
      this.themeIndex = 4;
    }
    else if (this.themeIndex == 4)  {
      this.themeIndex = 5;
    }
    else if (this.themeIndex == 5)  {
      this.themeIndex = 0;
    }
  }

  goVote() {
    this.isGoVoteOn = !this.isGoVoteOn;
    this.isRadialMenuOn = !this.isRadialMenuOn;
    // this.isSettingsOn = !this.isSettingsOn;
  }
  sendQrCode(item) {

    //  this.playSound('02 Alerts and Notifications/alert_high-intensity.wav', this.soundVolume);

    if (item === 'Instagram') {
      window.open('https://www.instagram.com/charlie_v_elite/', "_parent");
    }
    else if (item === 'FaceBook') {
      window.open('https://facebook.com/cesarvega.col', "_parent");
    }
    else if (item === 'LinkIn') {
      window.open('https://www.linkedin.com/in/cesar-vega-49563524/', "_parent");
    }
    else if (item === 'Tweeter') {
      window.open('https://twitter.com/XVEGAS1', "_parent");
    }
    else if (item === 'SnapChat') {
      window.open('https://www.snapchat.com/xvegas', "_parent");
    }
    else if (item === 'TikTok') {
      window.open('https://vm.tiktok.com/mrvrman2020', "_parent");
    }
    else if (item === 'WhatsApp') {
      window.open('https://wa.me/13053220070?text=Hola_Cesar_Vega', "_top");
    }
    else if (item === 'GMAIL') {
      window.open('https://flowcode.com/p/dfHPvVqQ1?fc=0', "_parent");
    }
    else if (item === 'Message') {
      window.open('flowcode.com/p/dfHmdzHyn?fc=0', "_parent");
    }
    else if (item === 'Phone') {
      window.open('tel:3053220070', "_parent");
    }
    else if (item === 'Ca$hApp') {
      window.open('https://cash.app/$mrvr', "_parent");
    }
    else if (item === 'Zelle') {
      window.open('https://docs.google.com/document/d/1nL9YZSCGbrVGxEwGCG7og4aPzHitMQ_b_6Mx5AG_vGw/edit?usp=sharing', "_parent");
    }
    else if (item === 'Venmo') {
      window.open('https://venmo.com/code?user_id=1239064166531072229&created=1628268361.098342&printed=1', "_parent");
    }
    else if (item === 'PayPal') {
      window.open('https://www.paypal.me/mrvrmen', "_parent");
    }
    else if (item === 'BitCoin') {
      window.open('https://commerce.coinbase.com/checkout/34de2ee0-80be-48d0-aedb-cedef7741b9c', "_parent");
    }
    else if (item === 'DogeCoin') {
      window.open('https://commerce.coinbase.com/checkout/34de2ee0-80be-48d0-aedb-cedef7741b9c', "_parent");
    }
    else if (item === 'Sound Cloud') {
      window.open('https://soundcloud.com/xvegas/techno_mix_01', "_parent");
    }
    else if (item === 'Spotify') {
      window.open('https://open.spotify.com/user/1213205584?si=N7v-2pLZSQmcHQgBUXKBhw&dl_branch=1', "_parent");
    }

    else if (item === 'Register') {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSdMNKyIQZm6cM8WQfa32kyRC1uP1TPvF1t1p7B6ZV8XMdlftw/viewform?usp=pp_url&entry.485428648=SOCIAL+MEDIA%0A%0AInstagram+++%3D%0ATikTok++++++%3D%0AFaceBook++++%3D%0ALinkIn++++++%3D%0ATweeter+++++%3D%0ASnapChat++++%3D%0A%0AMESSAGES+%26++Phones%0A%0AWhatsApp+++++%3D%0ATxT-Message%0APhone+Number%0AGMAIL++++++++%3D%0A%0APAYMENTS+QRCODES%0A%0ACashApp+%3D%0AVenmo+++++++%3D%0AZelle+++++++%3D%0APayPal++++++%3D%0ABitCoin+Address++++%3D%0ADogeCoin+Address+++%3D%0ACRYPTO++Address++++%3D%0A%0AARTIST+QRCODES%0A%0ASound+Cloud%0AYouTube+++++++%3D%0ASpotify+++++++%3D%0A%0A+BUSINESS+OR+WIFI%0A%0A+Website+++%3D%0A+Wifi++++++%3D++WIFI+name+and+WIFI+password%0A%0A+OTHER+URLS%0A++URL+%3D+&entry.1005527763=1', "_parent");
    }
    else if (item === 'Wifi') {
      // window.open('link', "_parent");
    }

  }

  playSound(soundEffect, volume) {
    let audio = new Audio();
    // audio.src = soundEffect;
    // audio.volume = volume;
    audio.src = "assets/sound/wav/" + soundEffect;
    audio.volume = volume;
    audio.load();
    audio.play();
  }

}
