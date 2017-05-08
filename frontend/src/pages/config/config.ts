import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { Confignotificacao } from '../../models/confignotificacao';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';

/*
  Generated class for the Config page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage implements OnInit {
  
  public config: Confignotificacao;  
  public cdusuario: string;
  public loading: any;
  
  constructor(public navCtrl: NavController,
      public sharingService: SharingService,
      public toastCtrl: ToastController,
      public loadingCtrl: LoadingController) {

    this.config = new Confignotificacao();
    this.sharingService.cdusuario.subscribe(cdusuario=>{
      this.cdusuario = cdusuario;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: false
    });
    this.loading.present();
  }

  ngOnInit(){
    this.sharingService.getConfiguraNotificacao(this.cdusuario).then(dados=>{
      if(!!dados && dados.length > 0){
        this.config = AppSettings.convertToConfignotificacao(dados[0]);        
      }

      this.loading.dismiss();
    });
  }
  
  salvar(){    
    this.config.cdusuario = this.cdusuario;
    this.sharingService.configuraNotificacao(this.config)
      .then(success => {
            let msg = "Configuração realizada com sucesso.";
            this.presentToast(msg);
            this.goBack();
        })
        .catch(error => {
            this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
        });
  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  goBack(){
    this.navCtrl.pop();
  }
}
