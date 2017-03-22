import { Component, ViewChild } from '@angular/core';
import { Platform, AlertController  } from 'ionic-angular';
import { StatusBar, Splashscreen, Network } from 'ionic-native';

import { Home } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MeuEstorage } from './meu-estorage';
import { SharingService } from '../services/sharing-service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

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
      this.rootPage = LoginPage; //Home;

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
    });
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