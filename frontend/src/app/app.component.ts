import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController  } from 'ionic-angular';
import { StatusBar, Splashscreen, Network, Push, Geolocation } from 'ionic-native';

import { Home } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MeuEstorage } from './meu-estorage';
import { SharingService } from '../services/sharing-service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  meuEstorage: MeuEstorage;
  
  disconnectSubscription: any;

  constructor(public platform: Platform, 
              public sharingService: SharingService,              
              public auth: AuthService,
              public alertCtrl: AlertController) {
    this.meuEstorage = new MeuEstorage(sharingService);
    this.initializeApp();  
    
    // watch network for a disconnect
    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      this.openAlertNotInternet();
    }); 
  }

 initializeApp() {    
    this.platform.ready().then(() => {      
      
      StatusBar.styleDefault();
      Splashscreen.hide();
      console.log("initializeApp ...");
      this.initPushNotification();
      this.initLocalizacaoUsuario();
      this.rootPage = Home;//LoginPage; //Home;
    });
  }
  
  initLocalizacaoUsuario(){
     //pega os produtos pela localizacao do usuario
      Geolocation.getCurrentPosition()
        .then((resp) => {              
            this.sharingService.setLat(resp.coords.latitude);
            this.sharingService.setLat(resp.coords.longitude);
        }).catch((error) => {
            console.log('Error getting location', error);              
        });
  }

  initPushNotification(){
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    var push = Push.init({
        android: {
          senderID: "874200786883"
        },
        ios: {
          alert: "true",
          badge: true,
          sound: 'false'
        },
        windows: {}
      });

      push.on('registration', (data) => {
        console.log("device token -> ", data.registrationId);  
        this.sharingService.setDevicetoken(data.registrationId);
      });

      push.on('notification', (data) => {        
        console.log('message', data.message);
        let self = this;
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
          // if application open, show popup
          let confirmAlert = this.alertCtrl.create({
            title: 'New Notification',
            message: data.message,
            buttons: [{
              text: 'Ignore',
              role: 'cancel'
            }, {
              text: 'View',
              handler: () => {
                //TODO: Your logic here
                //self.nav.push(DetailsPage, {message: data.message});
              }
            }]
          });
          confirmAlert.present();
        } else {
          //if user NOT using app and push notification comes
          //TODO: Your logic on click of push notification directly
          //self.nav.push(DetailsPage, {message: data.message});
          console.log("Push notification clicked");
        }
      });

      push.on('error', (e) => {
        console.log(e.message);
      });

      //This is the code who responds to the app deeplinks
			/*Deeplinks if from Ionic Native
	    Deeplinks.routeWithNavController(this.navChild, {
	        '/produto/:codigo': ViewProdutoPage
	      }).subscribe((match) => {
	        console.log('Successfully routed', match);
	      }, (nomatch) => {
	        console.log('Unmatched Route', nomatch);
	      });
        */
  }

  openAlertNotInternet(){
    let alert = this.alertCtrl.create({
            title: "Sem conexão com a internet",
            subTitle: "Por favor verifique sua conexão e tente novamente.",
            buttons: [{
              text: 'Ok',
              handler: () => {
                this.platform.exitApp();
              }
            }]
        });
    alert.present();
  }
}