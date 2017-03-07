import { Component } from '@angular/core';
import { NavController }  from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { Home } from '../home/home';

@Component({
  templateUrl: './login.html',
})
export class LoginPage {
  
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public navCtrl: NavController, public auth: AuthService) {
    auth.onlogin.subscribe((val) => {
      //console.log("Recebendo o resultado: "+val);
      if(this.auth.authenticated()) {
        this.navCtrl.setRoot(Home);
      }
    });
  }

  ionViewWillEnter() {
    //console.log("ionViewWillEnter Login....");
  } 

  retornoLogin = function(){
    //console.log("Retorno do login...");
    //this.navCtrl.setRoot(Home);
  };

  entrar(){
    this.auth.login();    
  }
}