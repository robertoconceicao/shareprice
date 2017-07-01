import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController  } from 'ionic-angular';
import { StatusBar, Splashscreen, Network, Push, Geolocation, NativeStorage, Deeplinks, Diagnostic } from 'ionic-native';
import { Home, ViewProdutoPage, TutorialPage, LoginPage } from '../pages';
import { SharingService } from '../services/sharing-service';
import { AppSettings }  from './app-settings';

//Utilizado para tratar as resposta de verificacao do GPS
const SUCCESS             = 0;
const ERRO_GPS_DISABLED   = 1;
const ERRO_NOT_AUTHORIZED = 2;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any}>;  
  disconnectSubscription: any;
  flVeioDoPush: boolean;

  constructor(public platform: Platform, 
              public sharingService: SharingService,
              public alertCtrl: AlertController) {    
    this.initializeApp();    
    // watch network for a disconnect
    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      this.openAlertNotInternet();
    }); 
  }

 initializeApp() {
    this.flVeioDoPush = false;
    this.platform.ready().then(() => {
      
    this.verificaGPSAtivo()
      .then((resp) => {                
        //pega os produtos pela localizacao do usuario
        Geolocation.getCurrentPosition({timeout: 10000})
          .then((resp) => {
              this.sharingService.setLat(resp.coords.latitude);
              this.sharingService.setLng(resp.coords.longitude); 
            
              let env = this;
              NativeStorage.getItem('user')
                .then( function (usuario) {
                  env.sharingService.setCdusuario(usuario.cdusuario);
                  env.sharingService.insereUsuario(usuario);
                  // se o usuario esta entrando pelo push notification ele cai direto dentro da tela de ViewProdutoPage
                  if(!env.flVeioDoPush){
                    env.nav.setRoot(Home);
                    Splashscreen.hide();
                  }
                }, function (error) {
                     NativeStorage.getItem('tutorial')
                      .then( function (resp){
                          let confirmAlert = env.alertCtrl.create({
                              title: "Usuário não identificado",
                              message: "Faça o login, para acesso a todas funcionalidades.",
                              buttons: [{
                                text: 'Ignorar',
                                handler: () => {
                                  env.nav.setRoot(Home);
                                }
                              }, {
                                text: 'Login',
                                handler: () => {
                                  env.nav.setRoot(LoginPage);
                                }
                              }]
                            });
                            confirmAlert.present();
                            Splashscreen.hide();
                      }, function (error) {
                          env.nav.setRoot(TutorialPage);
                          NativeStorage.setItem('tutorial', 1);
                          Splashscreen.hide();
                      });
                });
          }).catch((error) => {
              // this.verificaGPSAtivo();
              this.openAlertNotGeolocation("O Geladas não conseguiu pegar sua localização", "Por favor ligue sua localização e tente novamente.");
          });
      }).catch((error) => {
        console.log("Error verificaGPSAtivo: "+error); 
        if(error === ERRO_GPS_DISABLED){
          this.openAlertNotGeolocation("O serviço de localização esta desligado", "Por favor ligue sua localização e tente novamente.");
        } else {
          this.openAlertNotGeolocation("Você deve permitir que o aplicativo pegue sua localização", "Por favor autorize o serviço de localização e tente novamente.");        
        }
      });
      
      StatusBar.styleDefault();
      this.initPushNotification();      
      this.initDeeplink();
    });
  }

  verificaGPSAtivo(): Promise<any> {
    return new Promise((resolve, reject) => {
        Diagnostic.requestLocationAuthorization("when_in_use")
        .then((value) => {
          /*
          Diagnostic.isGpsLocationEnabled().then((enabled) => {
            if(!enabled){            
              reject(ERRO_GPS_DISABLED);
            }
          }).catch((error) => {
            console.log("Resultado 2: ", error);
            reject(ERRO_GPS_DISABLED);          
          });
          
          Diagnostic.isLocationAuthorized().then((enabled) => {
            if(!enabled){
              reject(ERRO_NOT_AUTHORIZED);            
            } else {
              resolve(SUCCESS);
            }
          }).catch((error) => {
            console.log("Resultado 3: ", error);
            reject(ERRO_NOT_AUTHORIZED);
          });
          */
          resolve(SUCCESS);
        }).catch((error)=>{
          console.log("Resultado 1: ", error);
          reject(ERRO_NOT_AUTHORIZED);
        });
        
    });
  }

  initDeeplink(){
    Deeplinks.route({
      '/produto/:codigo': ViewProdutoPage
    }).subscribe((match) => {
      // match.$route - the route we matched, which is the matched entry from the arguments to route()
      // match.$args - the args passed in the link
      // match.$link - the full link data
      let self = this;
      this.flVeioDoPush = true;
      this.nav.setRoot(Home);      
      this.sharingService.findProdutoById(match.$args.codigo)
          .then(produtos => {
              var _produto = AppSettings.convertToProduto(produtos[0]);
              self.nav.push(ViewProdutoPage, {produto: _produto});
          })
          .catch(error => {                        
            console.log("Erro ao carregar viewProduto direto do Deeplink", error);
            self.nav.setRoot(Home);
          });  
    }, (nomatch) => {      
    });
    //This is the code who responds to the app deeplinks
    //Deeplinks if from Ionic Native
    /*
    Deeplinks.routeWithNavController(this.nav, {
        '/produto/:codigo': ViewProdutoPage
      }).subscribe((match) => {
        console.log('Successfully routed', match);        
      }, (nomatch) => {
        console.log('Unmatched Route', nomatch);
      });      
      */
  }

  initPushNotification(){
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }

    var push = Push.init({
        android: {
          senderID: "449887022881",
          icon:"icon"
        },
        ios: {
          alert: "true",
          badge: true,
          sound: 'false'
        },
        windows: {}
      });

      push.on('registration', (data) => {        
        this.sharingService.setDevicetoken(data.registrationId);
        console.log("device token: "+data.registrationId);
      });

      push.on('notification', (data) => {
        let self = this;        
        let json = JSON.parse(JSON.stringify(data.additionalData));
        if (data.additionalData.foreground) {          
          let confirmAlert = this.alertCtrl.create({
            title: data.title,
            message: data.message,
            buttons: [{
              text: 'Ignorar',
              role: 'cancel'
            }, {
              text: 'Ver',
              handler: () => {
                this.sharingService.findProdutoById(json.codigo)
                    .then(produtos => {
                        var _produto = AppSettings.convertToProduto(produtos[0]);
                        self.nav.push(ViewProdutoPage, {produto: _produto});
                    })
                    .catch(error => {                        
                      console.log("Erro ao carregar viewProduto direto do push", error);
                      self.nav.setRoot(Home);
                    });
              }
            }]
          });
          confirmAlert.present();
        } else {          
          self.flVeioDoPush = true;
          Splashscreen.hide();
          self.nav.setRoot(Home);
          
          this.sharingService.findProdutoById(json.codigo)
              .then(produtos => {
                  var _produto = AppSettings.convertToProduto(produtos[0]);
                  self.nav.push(ViewProdutoPage, {produto: _produto});
              })
              .catch(error => {                        
                console.log("Erro ao carregar viewProduto direto do push", error);
                self.nav.setRoot(Home);
              });
        }
      });

      push.on('error', (e) => {
        console.log(e.message);
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

  openAlertNotGeolocation(title: string, subTitle: string){
    let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
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