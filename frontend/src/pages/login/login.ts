import {Component} from '@angular/core';
import { NavController }  from 'ionic-angular';
import {AuthService} from '../../services/auth/auth.service';
import { Home } from '../home/home';

@Component({
  templateUrl: './login.html',
})
export class LoginPage {
  
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public navCtrl: NavController, public auth: AuthService) {    
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter Login....");    
    this.carregandoPage();
  } 
/*
  ionViewDidEnter(){
    console.log("ionViewDidEnter Login 2 ....");    
    this.carregandoPage();
  }
*/
  carregandoPage(){
    if(!this.auth.authenticated()){
      this.auth.login();
    } else {
      // Schedule a token refresh on app start up
     // this.auth.startupTokenRefresh();
      this.navCtrl.setRoot(Home);
    }
  }
}