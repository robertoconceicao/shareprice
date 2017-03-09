import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Home } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MeuEstorage } from './meu-estorage';
import { SharingService } from '../services/sharing-service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  meuEstorage: MeuEstorage;

  constructor(public platform: Platform, 
              sharingService: SharingService,
              private auth: AuthService) {
    this.meuEstorage = new MeuEstorage(sharingService);
    this.initializeApp();   
  }

  ngOnInit(): void {
    console.log("ngOnInit...");
    //this.meuEstorage.loadStorage();
  }

  initializeApp() {    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
      console.log("initializeApp ...");
      this.rootPage = LoginPage; //Home; // LoginPage
    });
  }
}