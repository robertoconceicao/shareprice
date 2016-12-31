import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Produto } from '../../models/produto';
import { Categoria } from '../../models/categoria';
import { Unidademedida } from '../../models/unidademedida';
//import { AppSettings } from '../../app/app-settings';
import { SharingService } from '../../providers/sharing-service';

@Component({
  selector: 'page-cad-produto',
  templateUrl: 'cad-produto.html'
})
export class CadProdutoPage {

  public produto: Produto;

  public unidademedidas: Array<Unidademedida> = [
       new Unidademedida(1, 'Mililitro', 'ml'),
       new Unidademedida(2, 'Litro', 'l'),
       new Unidademedida(3, 'Quilograma', 'kg'),
       new Unidademedida(4, 'Metro', 'm'),
       new Unidademedida(5, 'Metro quadrado', 'm²'),
       new Unidademedida(6, 'Metro cúbico', 'm³'),
       new Unidademedida(7, 'Área', 'a')
   ];
   
  public categorias: Array<Categoria> = [
      new Categoria(1, 'Bebidas'),  
      new Categoria(2, 'Churrasco'),
      new Categoria(3, 'Limpeza'),
      new Categoria(4, 'Diversos')
  ];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toastCtrl: ToastController, 
              public sharingService: SharingService) {
      this.produto = new Produto();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadProdutoPage');
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