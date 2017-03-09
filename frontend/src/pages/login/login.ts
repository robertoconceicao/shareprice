import { Component, OnInit } from '@angular/core';
import { NavController }  from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { Home } from '../home/home';

@Component({
  templateUrl: './login.html',
})
export class LoginPage implements OnInit {
  
  // We need to inject AuthService so that we can
  // use it in the view
  constructor(public navCtrl: NavController, public auth: AuthService) {
    //Estou me inscrevendo para receber as alterações na variavel onlogin
    auth.onlogin.subscribe((val) => {      
      if(this.auth.authenticated()) {
        this.navCtrl.setRoot(Home);
      }
    });
  }

  ngOnInit(){
    this.auth.login();
  }   
}