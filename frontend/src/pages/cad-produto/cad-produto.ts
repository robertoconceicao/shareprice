import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ModalController  } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Produto } from '../../models/produto';

import { Loja } from '../../models/loja';
import { LojaPage } from '../loja/loja-page';
import { SharingService } from '../../services/sharing-service';
import { NumberUtil } from '../../util/number-util';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-cad-produto',
  templateUrl: 'cad-produto.html'
})
export class CadProdutoPage {

  public produto: Produto;

  public lat: any;
  public lng: any;  
  public loading: any;
  //por enquanto estou usando só a primeira loja q vem no array mas pode ser q eu precise mostrar uma lista de lojas por isso coloquei esse array
  public lojas: Array<Loja> = [];
  

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public sharingService: SharingService,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController) {
      this.produto = new Produto();

      this.sharingService.marcas.subscribe(marcas => {
        this.produto.marca = marcas[0];
      });
      this.sharingService.tipos.subscribe(tipos => {
        this.produto.tipo = tipos[0];
      });
      this.sharingService.medidas.subscribe(medidas => {
        this.produto.medida = medidas[0];
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadProdutoPage');
    this.loading = this.loadingCtrl.create({
      content: 'Carregando informações...'
    });

    this.loading.present();
 
    this.buscarIconeCerveja();
    // get localizacao do usuario
    this.getLojasByLocation();   
  }

  postar(): void {
    this.produto.preco = this.produto.preco.replace(/,/, '.'); //replace , por .
    this.sharingService.postar(this.produto)
      .then(success => {
            let msg = "Obrigado por cadastrar o produto";            
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

  getLojasByLocation(){
    //pega as lojas pela localizacao do usuario
    Geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;

      this.sharingService.findLojasByLocation(this.lat, this.lng)
          .then(lojas => {
            this.lojas = lojas;

            if(!!lojas && lojas.length > 0){
              this.produto.loja = this.lojas[0];
            }
            this.loading.dismiss();
          })
          .catch((error) => {
              console.log('Error ao tentar buscar lojas', error);
              this.loading.dismiss();
              this.goBack();
          })
    }).catch((error) => {
      console.log('Error getting location', error);
      this.loading.dismiss();
      this.goBack();
    });
  }

  buscarIconeCerveja(){
    if(this.produto.marca.cdmarca != 0 && this.produto.tipo.cdtipo != 0 && this.produto.medida.cdmedida != 0){
       this.sharingService.findIconeCerveja(this.produto.marca.cdmarca, this.produto.tipo.cdtipo, this.produto.medida.cdmedida)
        .then(icon => {
           if(!!icon && icon.length > 0){
              this.produto.icon = icon[0].icon;
           }
        })
        .catch((error) => {
            console.log('Error ao tentar buscar icone', error);
        });
    }
  }

  changeLoja(){
    let lojaModal = this.modalCtrl.create(LojaPage, {'lojas': this.lojas});
    lojaModal.onDidDismiss(data => {
      if(!!data){
        this.produto.loja = data;
      }
    });
    lojaModal.present();
  }

  onChangeMarca(event){
    this.produto.marca.cdmarca = event;
    this.buscarIconeCerveja();
  }

  onChangeTipo(event){
    this.produto.tipo.cdtipo = event;
    this.buscarIconeCerveja();
  }

  onChangeMedida(event){
    this.produto.medida.cdmedida = event;
    this.buscarIconeCerveja();
  }

  onChangePreco(event){
      this.produto.preco = NumberUtil.formataMoeda(event.target.value);
  }
}