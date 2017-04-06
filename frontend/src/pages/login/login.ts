import { Component } from '@angular/core';
import { Facebook, GooglePlus, NativeStorage } from 'ionic-native';
import { NavController, LoadingController } from 'ionic-angular';
import { Home } from '../home/home';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  FB_APP_ID: number = 1244276078941737;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController) {
    Facebook.browserInit(this.FB_APP_ID, "v2.8");
  }

  doFbLogin(){
    let permissions = new Array();
    let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];


    Facebook.login(permissions)
    .then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,gender", params)
      .then(function(user) {
        console.log("Login sucesso");
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        //now we have the users info, let's save it in the NativeStorage
        NativeStorage.setItem('user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture
        })
        .then(function(){
          nav.setRoot(Home);
        }, function (error) {
          console.log(error);
        })
      })
    }, function(error){
      console.log(error);
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
      content: 'Please wait...'
    });
    loading.present();
    GooglePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '449887022881-480nmee2j5il8rt23vaq2hf7vrecdghb.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
    .then(function (user) {
      loading.dismiss();

      NativeStorage.setItem('user', {
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      })
      .then(function(){
        nav.setRoot(Home);
      }, function (error) {
        console.log(error);
      })
    }, function (error) {
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