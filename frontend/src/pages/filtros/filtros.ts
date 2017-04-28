import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Filtro, Medida } from '../../models';
import { NumberUtil } from '../../util/number-util';
import { SharingService } from '../../services/sharing-service';
import { Home } from '../home/home';

@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html'
})
export class FiltrosPage implements OnInit {

  public filtro: Filtro;
  public medidas: Array<Medida> = [];
  public medidasFiltradas: Array<Medida> = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public sharingService: SharingService) {
  }

  ngOnInit(){
    this.sharingService.filtro.subscribe(filtrosDados => {
        this.filtro = filtrosDados;
    });

    this.sharingService.medidas.subscribe(medidas => {
      this.medidas = medidas;
    });
    this.medidasFiltradas = new Array<Medida>();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltrosPage');
      this.filtraMedidas();
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

  onChangeMarca(event){
    this.filtro.marca = event;
    this.filtraMedidas();
  }
  
  filtraMedidas() {
    var medidaspormarcas = this.sharingService.medidaspormarcas;
    var _medidas = new Array<number>();
    for(let i=0; i < medidaspormarcas.length; i++){
      if(!!this.filtro && medidaspormarcas[i].cdmarca == this.filtro.marca){        
        _medidas = medidaspormarcas[i].medidas; //retorna um array de cdmedidas configurados por marca
        break;
      }
    }

    this.medidasFiltradas = new Array<Medida>();
    for(let i=0; i < _medidas.length; i++){ //percorre a lista de medidas por marca onde só tem cdmedida
      for(let j=0; j < this.medidas.length; j++){ //percorre a lista de todas medidas com todas as informações
        if(_medidas[i] == this.medidas[j].cdmedida){
          this.medidasFiltradas.push(this.medidas[j]); //retorna o objeto medida com todas as informações
        }
      }
    }
    this.filtro.medida = null;
  }
}