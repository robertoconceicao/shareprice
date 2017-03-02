import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Marca } from '../../models/marca';
import { Medida } from '../../models/medida';
import { Tipo } from '../../models/tipo';
import { Filtro } from '../../models/filtro';
import { MeuEstorage, FILTRO } from '../../app/meu-estorage';
import { NumberUtil } from '../../util/number-util';
import { SharingService } from '../../services/sharing-service';

@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html'
})
export class FiltrosPage {

  public marcas: Array<Marca> = [];
  public medidas: Array<Medida> = [];
  public tipos: Array<Tipo> = [];

  public filtro: Filtro;
  public meuEstorage: MeuEstorage;

  constructor(public navCtrl: NavController, public navParams: NavParams, sharingService: SharingService) {
    this.filtro = new Filtro();
    this.filtro.distancia = 1;
    this.meuEstorage = new MeuEstorage(sharingService);
  }

  getMarcas(){    
    this.marcas = this.meuEstorage.getMarcas();   
  } 

  getTipos(){
    this.tipos = this.meuEstorage.getTipos();      
  }

  getMedidas(){
    this.medidas = this.meuEstorage.getMedidas();    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltrosPage');
    this.getMarcas();
    this.getTipos();
    this.getMedidas();

    if(!!this.meuEstorage.getFiltro()){
      this.filtro = this.meuEstorage.getFiltro();
    }
  }

  onChangePreco(event){
      this.filtro.maxvalor = NumberUtil.formataMoeda(event.target.value);
  }

  ionViewWillLeave(){
    if(!!this.filtro && (!!this.filtro.marca || !!this.filtro.medida || !!this.filtro.tipo || !!this.filtro.maxvalor || !!this.filtro.distancia)){
      this.meuEstorage.setFiltro(this.filtro);
    }
  }

  limparFiltros(){
    this.filtro = new Filtro();
    this.filtro.distancia = 1;
    this.meuEstorage.removeItem(FILTRO);
  }
}