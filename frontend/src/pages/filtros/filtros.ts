import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Filtro } from '../../models/filtro';
import { NumberUtil } from '../../util/number-util';
import { SharingService } from '../../services/sharing-service';
import { Home } from '../home/home';

@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html'
})
export class FiltrosPage implements OnInit {

  public filtro: Filtro;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public sharingService: SharingService) {
  }

  ngOnInit(){
    this.sharingService.filtro.subscribe(filtrosDados => {
        this.filtro = filtrosDados;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltrosPage');
  }

  onChangePreco(event){
      this.filtro.maxvalor = NumberUtil.formataMoeda(event.target.value);
  }

  ionViewWillLeave(){
    if(!!this.filtro && (!!this.filtro.marca || !!this.filtro.medida || !!this.filtro.tipo || !!this.filtro.maxvalor)){
      this.sharingService.setFiltro(this.filtro);
    }
  }

  limparFiltros(){
    this.filtro = new Filtro();
    this.filtro.distancia = 30;    
    this.sharingService.setFiltro(this.filtro);
  }

  goBack(){
    this.navCtrl.setRoot(Home);
  }
}