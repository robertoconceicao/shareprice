import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Marca } from '../../models/marca';
import { Medida } from '../../models/medida';
import { Tipo } from '../../models/tipo';
import { Filtro } from '../../models/filtro';
import { NumberUtil } from '../../util/number-util';
import { SharingService } from '../../services/sharing-service';

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
        console.log("Evento filtro FILTRO");
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
    if(!!this.filtro && (!!this.filtro.marca || !!this.filtro.medida || !!this.filtro.tipo || !!this.filtro.maxvalor || (this.filtro.distancia > 1))){
      this.sharingService.setFiltro(this.filtro);
    }
  }

  limparFiltros(){
    this.filtro = new Filtro();
    this.filtro.distancia = 1;    
    this.sharingService.setFiltro(this.filtro);
  }
}