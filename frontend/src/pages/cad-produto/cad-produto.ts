import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController  } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Produto } from '../../models/produto';
import { Categoria } from '../../models/categoria';
import { Loja } from '../../models/loja';
//import { AppSettings } from '../../app/app-settings';
import { SharingService } from '../../providers/sharing-service';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-cad-produto',
  templateUrl: 'cad-produto.html'
})
export class CadProdutoPage {

  public produto: Produto;

  public categorias: Array<Categoria> = [];
  public lat: any;
  public lng: any;
  
  //por enquanto estou usando só a primeira loja q vem no array mas pode ser q eu precise mostrar uma lista de lojas por isso coloquei esse array
  public lojas: Array<Loja> = [];

  public loja: Loja;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl: ToastController, 
              public sharingService: SharingService,
              public loadingCtrl: LoadingController) {
      this.produto = new Produto();
      this.loja = new Loja();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadProdutoPage');
    let loading = this.loadingCtrl.create({
      content: 'Carregando informações...'
    });
 
    loading.present();

    //get categorias
    this.sharingService.getCategorias() 
        .then(categorias => {
            this.categorias = categorias;
            if(this.categorias.length > 0){
              this.produto.cdcategoria = this.categorias[0].codigo;
            }

            //pega a localizacao do usuario
            Geolocation.getCurrentPosition().then((resp) => {
              this.lat = resp.coords.latitude;
              this.lng = resp.coords.longitude;

              this.sharingService.findLojasByLocation(this.lat, this.lng)
                  .then(lojas => {
                    this.lojas = lojas;

                    if(!!lojas && lojas.length > 0){                          
                      this.loja = this.lojas[0];
                      this.produto.cdloja = this.loja.codigo;
                    }
                    loading.dismiss();
                  })
                  .catch((error) => {
                      console.log('Error ao tentar buscar lojas', error);
                      loading.dismiss();        
                  })
            }).catch((error) => {
              console.log('Error getting location', error);
              loading.dismiss();
            });            
        })
        .catch(error => {
            this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
            loading.dismiss();
            this.goBack();
        });
  }

  postar() {
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
}