import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Confignotificacao } from '../../models/confignotificacao';
import { NumberUtil } from '../../util/number-util';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';
import { Marca } from '../../models/marca';
import { Tipo } from '../../models/tipo';
import { Medida } from '../../models/medida';

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

  constructor(public navCtrl: NavController,
      public sharingService: SharingService,
      public toastCtrl: ToastController) {

    this.sharingService.cdusuario.subscribe(cdusuario=>{
      this.cdusuario = cdusuario;
    });
    this.config = new Confignotificacao();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  ngOnInit(){
    this.sharingService.getConfiguraNotificacao(this.cdusuario).then(dados=>{
      if(!!dados && dados.length > 0){
        this.config = AppSettings.convertToConfignotificacao(dados[0]);
      }
    });
  }
  
  salvar(){    
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
