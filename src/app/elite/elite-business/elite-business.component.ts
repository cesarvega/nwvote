import { MESSAGES_CONTAINER_ID } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { EliteService } from '../elite.service';

@Component({
  selector: 'app-elite-business',
  templateUrl: './elite-business.component.html',
  styleUrls: ['./elite-business.component.scss']
})
export class EliteBusinessComponent implements OnInit {

  
  declare navigator: any;
  newVariable: any = window.navigator;
  QR_CODES: any = [
    // {
    //   name: 'Cesar Vega',
    //   description: 'Recruiter',
    //   imgSrc: './assets/img/elite/CesarVega/CesarRecruiter.png',
    // },
    {
      name: 'Instagram',
      description: 'Instagram',
      imgSrc: './assets/img/elite/CesarVega/Instagram.png',
    },
    {
      name: 'FaceBook',
      description: 'FaceBook',
      imgSrc: './assets/img/elite/CesarVega/FaceBook.png',
    },
    {
      name: 'LinkIn',
      description: 'LinkIn',
      imgSrc: './assets/img/elite/CesarVega/LinkIn.png',
    },
    {
      name: 'Tweeter',
      description: 'Tweeter',
      imgSrc: './assets/img/elite/CesarVega/Tweeter.png',
    },
    {
      name: 'SnapChat',
      description: 'SnapChat',
      imgSrc: './assets/img/elite/CesarVega/SnapChat.png',
    },
    {
      name: 'TikTok',
      description: 'TikTok',
      imgSrc: './assets/img/elite/CesarVega/TikTok.png',
    },
    {
      name: 'WhatsApp',
      description: 'WhatsApp',
      imgSrc: './assets/img/elite/CesarVega/WhatsApp.png',
    },
    {
      name: 'Message',
      description: 'Message',
      imgSrc: './assets/img/elite/CesarVega/Message.png',
    },
    {
      name: 'GMAIL',
      description: 'GMAIL',
      imgSrc: './assets/img/elite/CesarVega/GMAIL.png',
    },
    {
      name: 'Phone',
      description: 'Phone',
      imgSrc: './assets/img/elite/CesarVega/Phone.png',
    },
    {
      name: 'Ca$hApp',
      description: 'Ca$hApp',
      imgSrc: './assets/img/elite/CesarVega/Ca$hApp.png',
    },
    {
      name: 'Zelle',
      description: 'Zelle',
      imgSrc: './assets/img/elite/CesarVega/Zelle.png',
    },
    {
      name: 'Venmo',
      description: 'Venmo',
      imgSrc: './assets/img/elite/CesarVega/Venmo.png',
    },
    {
      name: 'PayPal',
      description: 'PayPal',
      imgSrc: './assets/img/elite/CesarVega/PayPal.png',
    },
    {
      name: 'BitCoin',
      description: 'BitCoin',
      imgSrc: './assets/img/elite/CesarVega/BitCoin.png',
    },
    {
      name: 'DogeCoin',
      description: 'DogeCoin',
      imgSrc: './assets/img/elite/CesarVega/DogeCoin.png',
    },
    {
      name: 'Sound Cloud',
      description: 'Sound Cloud',
      imgSrc: './assets/img/elite/CesarVega/Sound Cloud.png',
    },
    {
      name: 'Spotify',
      description: 'Spotify',
      imgSrc: './assets/img/elite/CesarVega/Spotify.png',
    },
    {
      name: 'YouTube',
      description: 'YouTube',
      imgSrc: './assets/img/elite/CesarVega/YouTube.png',
    },
    {
      name: 'Wifi',
      description: 'Wifi',
      imgSrc: './assets/img/elite/CesarVega/Wifi.png',
    },
    {
      name: 'Register',
      description: 'Register',
      imgSrc: './assets/img/elite/CesarVega/CesarRecruiter.png',
    },
  ]



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

  ngOnInit(): void {

    this.paramsRouter.params.subscribe(params => {
      this.tableNo = +params['id'];
    });

  }

  sendQrCode(item) {

    if (item.name === 'Instagram') {
      window.open('https://www.instagram.com/cesarvega_2020/', "_blank");
    }
    else if (item.name === 'FaceBook') {
      window.open('https://facebook.com/cesarvega.col', "_blank");
    }
    else if (item.name === 'LinkIn') {
      window.open('https://www.linkedin.com/in/cesar-vega-49563524/', "_blank");
    }
    else if (item.name === 'Tweeter') {
      window.open('https://twitter.com/XVEGAS1', "_blank");
    }
    else if (item.name === 'SnapChat') {
      window.open('https://www.snapchat.com/xvegas', "_blank");
    }
    else if (item.name === 'TikTok') {
      window.open('https://vm.tiktok.com/mrvrman2020', "_blank");
    }
    else if (item.name === 'WhatsApp') {
      window.open('https://wa.me/13053220070?text=Hola_Cesar_Vega', "_blank");
    }
    else if (item.name === 'GMAIL') {
      window.open('https://flowcode.com/p/dfHPvVqQ1?fc=0', "_blank");
    }
    else if (item.name === 'Message') {
      window.open('flowcode.com/p/dfHmdzHyn?fc=0', "_blank");
    }
    else if (item.name === 'Phone') {
      window.open('tel:3053220070', "_blank");
    }
    else if (item.name === 'Ca$hApp') {
      window.open('https://cash.app/$mrvr', "_blank");
    }
    else if (item.name === 'Zelle') {
      window.open('https://docs.google.com/document/d/1nL9YZSCGbrVGxEwGCG7og4aPzHitMQ_b_6Mx5AG_vGw/edit?usp=sharing', "_blank");
    }
    else if (item.name === 'Venmo') {
      window.open('https://venmo.com/code?user_id=1239064166531072229&created=1628268361.098342&printed=1', "_blank");
    }
    else if (item.name === 'PayPal') {
      window.open('https://www.paypal.me/mrvrmen', "_blank");
    }
    else if (item.name === 'BitCoin') {
      window.open('https://commerce.coinbase.com/checkout/34de2ee0-80be-48d0-aedb-cedef7741b9c', "_blank");
    }
    else if (item.name === 'DogeCoin') {
      window.open('https://commerce.coinbase.com/checkout/34de2ee0-80be-48d0-aedb-cedef7741b9c', "_blank");
    }
    else if (item.name === 'Sound Cloud') {
      window.open('https://soundcloud.com/xvegas/techno_mix_01', "_blank");
    }
    else if (item.name === 'Spotify') {
      window.open('https://open.spotify.com/user/1213205584?si=N7v-2pLZSQmcHQgBUXKBhw&dl_branch=1', "_blank");
    }
    else if (item.name === 'YouTube') {
      window.open('https://www.youtube.com/user/piratacd2005/videos', "_blank");
    }
    else if (item === 'eliteCesar') {
      window.open('http://mrvrman.com/elitecesar/', "_blank");
    }
    else if (item.name === 'Register') {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSdMNKyIQZm6cM8WQfa32kyRC1uP1TPvF1t1p7B6ZV8XMdlftw/viewform?usp=pp_url&entry.485428648=SOCIAL+MEDIA%0A%0AInstagram+++%3D%0ATikTok++++++%3D%0AFaceBook++++%3D%0ALinkIn++++++%3D%0ATweeter+++++%3D%0ASnapChat++++%3D%0A%0AMESSAGES+%26++Phones%0A%0AWhatsApp+++++%3D%0ATxT-Message%0APhone+Number%0AGMAIL++++++++%3D%0A%0APAYMENTS+QRCODES%0A%0ACashApp+%3D%0AVenmo+++++++%3D%0AZelle+++++++%3D%0APayPal++++++%3D%0ABitCoin+Address++++%3D%0ADogeCoin+Address+++%3D%0ACRYPTO++Address++++%3D%0A%0AARTIST+QRCODES%0A%0ASound+Cloud%0AYouTube+++++++%3D%0ASpotify+++++++%3D%0A%0A+BUSINESS+OR+WIFI%0A%0A+Website+++%3D%0A+Wifi++++++%3D++WIFI+name+and+WIFI+password%0A%0A+OTHER+URLS%0A++URL+%3D+&entry.1005527763=1', "_blank");
    }
    else if (item.name === 'Wifi') {
      // window.open('link', "_blank");
    }

  }

  crypto() {
    window.open('https://commerce.coinbase.com/checkout/d983d382-1345-4214-9518-fb7d3ca97b27', "_top");
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


}

  // SOCIAL MEDIA QRCODES

  // Instagram   =   https://www.instagram.com/YOUR_USERNAME
  // TikTok      =   https://vm.tiktok.com/YOUR_USERNAME
  // FaceBook    =   https://facebook.com/YOUR_USERNAME
  // LinkIn      =   https://www.linkedin.com/in/YOUR_USERNAME/
  // Tweeter     =   https://twitter.com/YOUR_USERNAME
  // SnapChat    =   https://www.snapchat.com/YOUR_USERNAME

  // MESSAGES & PHONE QRCODES

  // WhatsApp     =   YOUR_PHONE_NUMBER, text    = Hello_Cesar_Vega
  // TxT-Message  =   YOUR_PHONE_NUMBER; Message = Hello Cesar Vega  
  // Phone Number =   YOUR_PHONE_NUMBER
  // GMAIL        =   YOUR_EMAIL, MENSAGE, SUBJECT


  // PAYMENTS QRCODES
  // Ca$hApp     =   YOUR_USERNAME
  // Venmo       =   YOUR_USERNAME
  // Zelle       =   ZELLE EMAIL, or PHONE NUMBER , First name  and Last name
  // PayPal      =   YOUR_USERNAME
  // BitCoin     =   BITCOIN_ADDRESS : 12sN4AYbGDZ9vgKKw8XoN4rhsmSiq4ztRz
  // DogeCoin    =   DOGECOIN_ADDRESS : 12sN4AYbGDZ9vgKKw8XoN4rhsmSiq4ztRz
  // CRYPTO      =   CRYPTO_ADDRESS : 12sN4AYbGDZ9vgKKw8XoN4rhsmSiq4ztRz

  // ARTIST QRCODES

  // Sound Cloud   =   SOUND_CLOUD  URL
  // YouTube       =   YOUTUBE URL
  // Spotify       =   SPOTIFY URL

  // BUSINESS OR PERSONAL QRCODES

  // Website   =  www.yourwebste.com
  // Wifi      =   WIFI Name: WIFI:PASSWORD

  // ADD NOT LISTED QRCODE

  // URL = "  "
