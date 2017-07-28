import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NumberUtil } from '../../util/number-util';
import { SharingService } from '../../services/sharing-service';
import { ModalController  } from 'ionic-angular';
import { Home, MarcaPage, LocalusuarioPage } from '../../pages';
import { Filtro, Medida, Marca, Municipio } from '../../models';

@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html'
})
export class FiltrosPage implements OnInit {

  public filtro: Filtro;
  public medidas: Array<Medida> = [];
  public medidasFiltradas: Array<Medida> = [];
  public marcas: Array<Marca> = [];
  public municipio: Municipio;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public modalCtrl: ModalController,
              public sharingService: SharingService) {
  }

  ngOnInit(){

    this.sharingService.municipio.subscribe(dado => this.municipio = dado);

    this.sharingService.filtro.subscribe(filtrosDados => {
        this.filtro = filtrosDados;
    });

    this.sharingService.marcas.subscribe(marcas => {
      this.marcas = marcas;
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

  changeMarca(){
    let marcaModal = this.modalCtrl.create(MarcaPage, {'marcas': this.marcas});
    marcaModal.onDidDismiss(data => {
      if(!!data){
        this.filtro.marca = data;
        this.filtraMedidas();
      }
    });
    marcaModal.present();
  }

  changeLocal() {
      let localModal = this.modalCtrl.create(LocalusuarioPage);
      localModal.onDidDismiss(m => {
          this.sharingService.setMunicipio(m);
      });
      localModal.present();
  }
  
  filtraMedidas() {
    var medidaspormarcas = this.sharingService.medidaspormarcas;
    var _medidas = new Array<number>();
    for(let i=0; i < medidaspormarcas.length; i++){
      if(!!this.filtro && medidaspormarcas[i].cdmarca == this.filtro.marca.cdmarca){        
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