import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController, ToastController } from 'ionic-angular';
import { StatusBar, Splashscreen, Network, Push, Geolocation, NativeStorage, Deeplinks, Diagnostic } from 'ionic-native';
import { Home, ViewProdutoPage, TutorialPage, LoginPage, MarcaPage, CadProdutoPage, FiltrosPage,  ConfigPage, SelecionalocalizacaoPage } from '../pages';
import { SharingService } from '../services/sharing-service';
import { AppSettings }  from './app-settings';
import { Usuario } from '../models/usuario';
import { ImageLoaderConfig } from 'ionic-image-loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any}>;  
  connectSubscription: any;
  disconnectSubscription: any;
  flVeioDoPush: boolean;
  toast: any;

  tabHome = Home;
  tabFilter = FiltrosPage;
  tabAdd = CadProdutoPage;
  tabNotificacao = ConfigPage;
  tabLocal = SelecionalocalizacaoPage;
  
  constructor(public platform: Platform, 
              public sharingService: SharingService,
              public alertCtrl: AlertController,
              public imageLoaderConfig: ImageLoaderConfig,
              public toastCtrl: ToastController) {    
    this.initializeApp();    

    if (Network.connection === 'none' || Network.connection === 'unknown') {
      this.criarToastConexao();
    }

    this.disconnectSubscription = Network.onDisconnect().subscribe(() => {
      this.criarToastConexao();
    }); 

    this.connectSubscription = Network.onConnect().subscribe(() => {
      this.toast.dismiss();
    });
 }

 criarToastConexao(){
      this.toast = this.toastCtrl.create({
        message: "Sem conexão com a Internet :-("
      });
      this.toast.present();
 }

 initializeApp() {
    this.flVeioDoPush = false;
    this.platform.ready().then(() => {
      let env = this;
      NativeStorage.getItem(AppSettings.KEY_TUTORIAL)
                   .then( function (resp){
                        Splashscreen.hide();
                        if(!env.flVeioDoPush){
                           env.verificaSeTemMunicipioConfig();
                        }
                    }, function (error) {
                        env.nav.setRoot(TutorialPage);
                        NativeStorage.setItem(AppSettings.KEY_TUTORIAL, 1);
                        Splashscreen.hide();
                    });
      StatusBar.styleDefault();
      this.initPushNotification();      
      this.initDeeplink();
    });

    this.initImageLoaderConfig();
  }
  
  initImageLoaderConfig() {
    // enable debug mode to get console logs and stuff
    // this.imageLoaderConfig.enableDebugMode();
    // set a fallback url to use by default in case an image is not found
    this.imageLoaderConfig.setFallbackUrl('assets/fallback.png');

    //this.imageLoaderConfig.setImageReturnType('base64');

    this.imageLoaderConfig.setSpinnerColor('primary');
    this.imageLoaderConfig.setSpinnerName('bubbles');

    this.imageLoaderConfig.setWidth('64px');
    this.imageLoaderConfig.setHeight('64px');

    this.imageLoaderConfig.setConcurrency(5); 

    this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024); // set max size to 20MB
    this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days
  }

  verificaSeTemMunicipioConfig(){
    let env = this;
    NativeStorage.getItem(AppSettings.KEY_LISTA_MUNICIPIOS)
                 .then(function(resp) {
                    env.sharingService.setMunicipios(resp);
                 });
    
    NativeStorage.getItem(AppSettings.KEY_USUARIO)
                .then( function (usuario) {
                    if(usuario.cdusuario == 'G115862700861296845675'){
                       NativeStorage.remove(AppSettings.KEY_USUARIO);
                    } else {
                      env.sharingService.setCdusuario(usuario.cdusuario);
                    }
                }, function (error) {
                });
                
    NativeStorage.getItem(AppSettings.KEY_LOCAL_USUARIO)
                 .then( function (resp) {
                    env.sharingService.setMunicipio(resp);
                    env.nav.setRoot(Home);
                 }, function (error) {
                    env.nav.setRoot(SelecionalocalizacaoPage); //seleciona-localizacao
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
            self.nav.setRoot(SelecionalocalizacaoPage);
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
                self.sharingService.findProdutoById(json.codigo)
                    .then(produtos => {
                        var _produto = AppSettings.convertToProduto(produtos[0]);
                        self.nav.push(ViewProdutoPage, {produto: _produto});
                    })
                    .catch(error => {                        
                      console.log("Erro ao carregar viewProduto direto do push", error);
                      self.nav.setRoot(SelecionalocalizacaoPage);
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
                self.nav.setRoot(SelecionalocalizacaoPage);
              });
        }
      });

      push.on('error', (e) => {
        console.log(e.message);
      });
  } 

/*
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
  */
}