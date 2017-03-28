import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Confignotificacao } from '../../models/confignotificacao';
import { NumberUtil } from '../../util/number-util';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public sharingService: SharingService) {
    this.sharingService.cdusuario.subscribe(cdusuario=>{
      this.cdusuario = cdusuario;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  ngOnInit(){
    this.sharingService.getConfiguraNotificacao(this.cdusuario).then(dados=>{
      this.config = AppSettings.convertToConfignotificacao(dados[0]);
    });
  }
  
  goBack(){
    this.navCtrl.pop();
  }
}
