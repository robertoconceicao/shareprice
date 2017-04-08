import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController  } from 'ionic-angular';
import { StatusBar, Splashscreen, Network, Push, Geolocation, NativeStorage } from 'ionic-native';

import { Home } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MeuEstorage } from './meu-estorage';
import { SharingService } from '../services/sharing-service';
import { AuthService } from '../services/auth/auth.service';
import { Usuario } from '../models/usuario';

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
      
      //pega os produtos pela localizacao do usuario
      Geolocation.getCurrentPosition()
        .then((resp) => {
            console.log("resp location: lat: "+resp.coords.latitude+" lng: "+resp.coords.longitude);
            this.sharingService.setLat(resp.coords.latitude);
            this.sharingService.setLng(resp.coords.longitude);           

            
           let env = this;
           NativeStorage.getItem('user')
            .then( function (data) {
              env.sharingService.setCdusuario(data.userId);

              //Atualiza as informaçoes do usuario, principalmente por causa da localização
              let usuario: Usuario = new Usuario();
              usuario.cdusuario = data.userId;
              usuario.nome = data.name;
              usuario.avatar = data.picture;
              
              env.sharingService.insereUsuario(usuario);

              env.nav.setRoot(Home);
              Splashscreen.hide();
            }, function (error) {
              //we don't have the user data so we will ask him to log in
              env.nav.setRoot(LoginPage);
              Splashscreen.hide();
            });             
           // Splashscreen.hide();
           // this.rootPage = LoginPage;//Home;
      }).catch((error) => {
           console.log('Error getting location', error);              
      });

      StatusBar.styleDefault();
      this.initPushNotification();      
    });
  }
    
  

  initPushNotification(){
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    var push = Push.init({
        android: {
          senderID: "449887022881"
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
            title: 'Promoção de cerveja perto de você',
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