import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Produto } from '../../models/produto';
import { Categoria } from '../../models/categoria';
import { Unidademedida } from '../../models/unidademedida';
import { AppSettings } from '../../app/app-settings';
/*
  Generated class for the CadProduto page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cad-produto',
  templateUrl: 'cad-produto.html'
})
export class CadProdutoPage {

  public produto: Produto;
  public categorias: Array<Categoria> = AppSettings.categorias;
  public unidademedidas: Array<Unidademedida> = AppSettings.unidademedidas;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.produto = new Produto();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadProdutoPage');
  }
}