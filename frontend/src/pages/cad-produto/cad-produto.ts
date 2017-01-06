import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController  } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Produto } from '../../models/produto';
import { Marca } from '../../models/marca';
import { Medida } from '../../models/medida';
import { Tipo } from '../../models/tipo';
import { Loja } from '../../models/loja';

import { SharingService } from '../../providers/sharing-service';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-cad-produto',
  templateUrl: 'cad-produto.html'
})
export class CadProdutoPage {

  public produto: Produto;

  public marcas: Array<Marca> = [];
  public medidas: Array<Medida> = [];
  public tipos: Array<Tipo> = [];

  public lat: any;
  public lng: any;
  public loading: any;
  //por enquanto estou usando só a primeira loja q vem no array mas pode ser q eu precise mostrar uma lista de lojas por isso coloquei esse array
  public lojas: Array<Loja> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl: ToastController, 
              public sharingService: SharingService,
              public loadingCtrl: LoadingController) {
      this.produto = new Produto();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadProdutoPage');
    this.loading = this.loadingCtrl.create({
      content: 'Carregando informações...'
    });
 
    this.loading.present();

    // chama em cascata o getTipos, getMedidas e as lojas pela localizacao do usuario.
    this.getMarcas();
  }

  postar(): void{
    this.sharingService.postar(this.produto)
      .then(success => {
            this.presentToast("Obrigado por cadastrar o produto");
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

  getMarcas(){
    //get marcas
    this.sharingService.getMarcas() 
        .then(marcas => {
            this.marcas = marcas;
            if(this.marcas.length > 0){
              this.produto.marca = this.marcas[0];
            }
            // get tipos
            this.getTipos();                        
        })
        .catch(error => {
            this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
            this.loading.dismiss();
            this.goBack();
        });
  }

  getTipos(){
    //get tipos
    this.sharingService.getTipos() 
        .then(tipos => {
            this.tipos = tipos;
            if(this.tipos.length > 0){
              this.produto.tipo = this.tipos[0];
            }
            // get medidas
            this.getMedidas();                        
        })
        .catch(error => {
            this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
            this.loading.dismiss();
            this.goBack();
        });
  }

  getMedidas(){
    //get medidas
    this.sharingService.getMedidas() 
        .then(medidas => {
            this.medidas = medidas;
            if(this.medidas.length > 0){
              this.produto.medida = this.medidas[0];
            }
            // get localizacao do usuario
            this.getLojasByLocation();
        })
        .catch(error => {
            this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
            this.loading.dismiss();
            this.goBack();
        });
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
}