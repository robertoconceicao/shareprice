import { Component, ViewChild  } from '@angular/core';
import { Platform, Nav, NavController } from 'ionic-angular';
import { StatusBar, Splashscreen, Deeplinks } from 'ionic-native';

import { Home } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ViewProdutoPage } from '../pages/produto/view-produto';
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

  @ViewChild(Nav) navChild:Nav;

  constructor(public platform: Platform, 
              sharingService: SharingService,
              private auth: AuthService) {
    this.meuEstorage = new MeuEstorage(sharingService);
    this.initializeApp();   
  }
 

  initializeApp() {    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      console.log("initializeApp ...");
      this.rootPage = Home; // LoginPage

      //This is the code who responds to the app deeplinks
			//Deeplinks if from Ionic Native
	    Deeplinks.routeWithNavController(this.navChild, {
	        '/produto/:codigo': ViewProdutoPage
	      }).subscribe((match) => {
	        console.log('Successfully routed', match);
	      }, (nomatch) => {
	        console.log('Unmatched Route', nomatch);
	      });
    });
  }
}