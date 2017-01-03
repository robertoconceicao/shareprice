import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController  } from 'ionic-angular';
import { Produto } from '../../models/produto';
import { Categoria } from '../../models/categoria';
import { Unidademedida } from '../../models/unidademedida';
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

  public unidademedidas: Array<Unidademedida> = [];
  public categorias: Array<Categoria> = [];
/*
       new Unidademedida(1, 'Mililitro', 'ml'),
       new Unidademedida(2, 'Litro', 'l'),
       new Unidademedida(3, 'Quilograma', 'kg'),
       new Unidademedida(4, 'Metro', 'm'),
       new Unidademedida(5, 'Metro quadrado', 'm²'),
       new Unidademedida(6, 'Metro cúbico', 'm³'),
       new Unidademedida(7, 'Área', 'a')
   ];
   
      new Categoria(1, 'Bebidas'),  
      new Categoria(2, 'Churrasco'),
      new Categoria(3, 'Limpeza'),
      new Categoria(4, 'Diversos')
  ];
*/
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl: ToastController, 
              public sharingService: SharingService,
              public loadingCtrl: LoadingController) {
      this.produto = new Produto();
      this.produto.descricao="Novo produto";      
      this.produto.quantidade = 1;
      this.produto.preco=100;
      this.produto.loja = new Loja();
      
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
          // get unidademedidas
          this.sharingService.getUnidademedidas()
            .then(unidademedidas =>  {
                this.unidademedidas = unidademedidas;    
                loading.dismiss();
            })
            .catch(error => {
                this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
                loading.dismiss();
            });
        })
        .catch(error => {
            this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
            loading.dismiss();
        });
  }

  postar() {
    this.sharingService.postar(this.produto)
      .then(success => {
            this.presentToast("Obrigado por cadastrar o produto");
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
}