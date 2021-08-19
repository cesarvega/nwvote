import { Component, OnInit } from '@angular/core';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-elite-business-card',
  templateUrl: './elite-business-card.component.html',
  styleUrls: ['./elite-business-card.component.scss']
})
export class EliteBusinessCardComponent implements OnInit {
  isGoVoteOn = true;
  isRadialMenuOn = false;
  faInstagram = faInstagram
  logoInitial = 'C'
  username = 'Charlie V'
  userDescription = 'CEO'
  title = 'Elite'
  constructor() { }

  ngOnInit(): void {
  }
  goVote() {
    this.isGoVoteOn = !this.isGoVoteOn;
    this.isRadialMenuOn = !this.isRadialMenuOn;
  }
  sendQrCode(item) {

    if (item === 'Instagram') {
      window.open('https://www.instagram.com/cesarvega_2020/', "_blank");
    }
    else if (item === 'FaceBook') {
      window.open('https://facebook.com/cesarvega.col', "_blank");
    }
    else if (item === 'LinkIn') {
      window.open('https://www.linkedin.com/in/cesar-vega-49563524/', "_blank");
    }
    else if (item === 'Tweeter') {
      window.open('https://twitter.com/XVEGAS1', "_blank");
    }
    else if (item === 'SnapChat') {
      window.open('https://www.snapchat.com/xvegas', "_blank");
    }
    else if (item === 'TikTok') {
      window.open('https://vm.tiktok.com/mrvrman2020', "_blank");
    }
    else if (item === 'WhatsApp') {
      window.open('https://wa.me/13053220070?text=Hola_Cesar_Vega', "_blank");
    }
    else if (item === 'GMAIL') {
      window.open('https://flowcode.com/p/dfHPvVqQ1?fc=0', "_blank");
    }
    else if (item === 'Message') {
      window.open('flowcode.com/p/dfHmdzHyn?fc=0', "_blank");
    }
    else if (item === 'Phone') {
      window.open('tel:3053220070', "_blank");
    }
    else if (item === 'Ca$hApp') {
      window.open('https://cash.app/$mrvr', "_blank");
    }
    else if (item === 'Zelle') {
      window.open('https://docs.google.com/document/d/1nL9YZSCGbrVGxEwGCG7og4aPzHitMQ_b_6Mx5AG_vGw/edit?usp=sharing', "_blank");
    }
    else if (item === 'Venmo') {
      window.open('https://venmo.com/code?user_id=1239064166531072229&created=1628268361.098342&printed=1', "_blank");
    }
    else if (item === 'PayPal') {
      window.open('https://www.paypal.me/mrvrmen', "_blank");
    }
    else if (item === 'BitCoin') {
      window.open('https://commerce.coinbase.com/checkout/34de2ee0-80be-48d0-aedb-cedef7741b9c', "_blank");
    }
    else if (item === 'DogeCoin') {
      window.open('https://commerce.coinbase.com/checkout/34de2ee0-80be-48d0-aedb-cedef7741b9c', "_blank");
    }
    else if (item === 'Sound Cloud') {
      window.open('https://soundcloud.com/xvegas/techno_mix_01', "_blank");
    }
    else if (item === 'Spotify') {
      window.open('https://open.spotify.com/user/1213205584?si=N7v-2pLZSQmcHQgBUXKBhw&dl_branch=1', "_blank");
    }

    else if (item === 'Register') {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSdMNKyIQZm6cM8WQfa32kyRC1uP1TPvF1t1p7B6ZV8XMdlftw/viewform?usp=pp_url&entry.485428648=SOCIAL+MEDIA%0A%0AInstagram+++%3D%0ATikTok++++++%3D%0AFaceBook++++%3D%0ALinkIn++++++%3D%0ATweeter+++++%3D%0ASnapChat++++%3D%0A%0AMESSAGES+%26++Phones%0A%0AWhatsApp+++++%3D%0ATxT-Message%0APhone+Number%0AGMAIL++++++++%3D%0A%0APAYMENTS+QRCODES%0A%0ACashApp+%3D%0AVenmo+++++++%3D%0AZelle+++++++%3D%0APayPal++++++%3D%0ABitCoin+Address++++%3D%0ADogeCoin+Address+++%3D%0ACRYPTO++Address++++%3D%0A%0AARTIST+QRCODES%0A%0ASound+Cloud%0AYouTube+++++++%3D%0ASpotify+++++++%3D%0A%0A+BUSINESS+OR+WIFI%0A%0A+Website+++%3D%0A+Wifi++++++%3D++WIFI+name+and+WIFI+password%0A%0A+OTHER+URLS%0A++URL+%3D+&entry.1005527763=1', "_blank");
    }
    else if (item === 'Wifi') {
      // window.open('link', "_blank");
    }

  }


}
