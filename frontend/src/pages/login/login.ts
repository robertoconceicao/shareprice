import { Component, OnInit } from '@angular/core';
import { NavController }  from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { Home } from '../home/home';

import { FacebookAuth, GoogleAuth, User } from '@ionic/cloud-angular';


@Component({
  templateUrl: './login.html',
})
export class LoginPage implements OnInit {
  
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public navCtrl: NavController,
              public facebookAuth: FacebookAuth, 
              public googleAuth: GoogleAuth,
              public user: User) {

  }
  /*
  constructor(public navCtrl: NavController, public auth: AuthService) {
    //Estou me inscrevendo para receber as alterações na variavel onlogin
    auth.onlogin.subscribe((val) => {      
      if(this.auth.authenticated()) {
        this.navCtrl.setRoot(Home);
      }
    });
  }

  */  
  ngOnInit(){
    console.log("Iniciando LoginPage");
    // this.auth.login();
    
    /*
    this.facebookAuth.login().then(res => {
        console.log("resposta: "+res);
        this.navCtrl.setRoot(Home);
    });
  */
  
    this.googleAuth.login().
      then(res => {
        console.log("resposta: google "+res);
        this.navCtrl.setRoot(Home);
      })
      .catch(err =>{
        console.log("Error: "+err);
      });

  } 
}