import { Component } from '@angular/core';
import { Facebook, GooglePlus, NativeStorage } from 'ionic-native';
import { NavController, LoadingController } from 'ionic-angular';
import { Home } from '../../pages';
import { Usuario } from '../../models/usuario';
import { SharingService } from '../../services/sharing-service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  FB_APP_ID: number = 1244276078941737;

  constructor(public navCtrl: NavController,
              public sharingService: SharingService,
              public loadingCtrl: LoadingController) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  doFbLogin(){
    let permissions = new Array();
    let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["email"];

    let env = this;

    Facebook.login(permissions)
    .then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,gender,email", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        
        console.log("resposta FB: ", JSON.stringify(user));

        env.sharingService.setCdusuario(userId);
        
        //insere um novo usuario no sistema
        let usuario: Usuario = new Usuario();
        usuario.cdusuario = userId;
        usuario.nome = user.name;
        usuario.avatar = user.picture;
        usuario.email = user.email;
        
        env.sharingService.insereUsuario(usuario);

        //now we have the users info, let's save it in the NativeStorage
        NativeStorage.setItem('user', usuario)
        .then(function(){          
          nav.setRoot(Home);
        }, function (error) {
          console.log(error);
        })
      })
    }, function(error){
      console.log("Error login FB: ", JSON.stringify(error));
    });
  }

  doFbLogout(){
    var nav = this.navCtrl;
    Facebook.logout()
    .then(function(response) {
      //user logged out so we will remove him from the NativeStorage
      NativeStorage.remove('user');
      nav.setRoot(LoginPage);
    }, function(error){
      console.log(error);
    });
  }

  doGoogleLogin(){
    let nav = this.navCtrl;
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: false
    });
    loading.present();

    let env = this;

    GooglePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '449887022881-0f3qgjul4igf4dgajgfon3uos89bpv3h.apps.googleusercontent.com',
      'offline': true
    })
    .then(function (user) {
      loading.dismiss();
      console.log("Resposta do login G+: ", JSON.stringify(user));
      env.sharingService.setCdusuario(user.userId);
        
      //insere um novo usuario no sistema
      let usuario: Usuario = new Usuario();
      usuario.cdusuario = user.userId;
      usuario.nome = user.displayName;
      usuario.avatar = user.imageUrl;
      usuario.email = user.email;

      env.sharingService.insereUsuario(usuario);

      NativeStorage.setItem('user', usuario)
      .then(function(){
        nav.setRoot(Home);
      }, function (error) {
        console.log(error);
      })
    }, function (error) {
      console.log("Resposta Error login G+: ", JSON.stringify(error));
      loading.dismiss();
    });
  }  

  doGoogleLogout(){
    let nav = this.navCtrl;
    GooglePlus.logout()
    .then(function (response) {
      NativeStorage.remove('user');
      nav.setRoot(LoginPage);
    },function (error) {
      console.log(error);
    })
  }
}