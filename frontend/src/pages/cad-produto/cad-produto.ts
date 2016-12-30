import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Produto } from '../../models/produto';
import { Categoria } from '../../models/categoria';
import { Unidademedida } from '../../models/unidademedida';
//import { AppSettings } from '../../app/app-settings';

@Component({
  selector: 'page-cad-produto',
  templateUrl: 'cad-produto.html'
})
export class CadProdutoPage {

  public produto: Produto;

  public unidademedidas: Array<Unidademedida> = [
       new Unidademedida(1, 'Litro', 'l'),
       new Unidademedida(2, 'Quilograma', 'kg'),
       new Unidademedida(3, 'Metro', 'm'),
       new Unidademedida(4, 'Metro quadrado', 'm²'),
       new Unidademedida(5, 'Metro cúbico', 'm³'),
       new Unidademedida(6, 'Área', 'a')
   ];
   
  public categorias: Array<Categoria> = [
      new Categoria(1, 'Bebidas'),  
      new Categoria(2, 'Churrasco'),
      new Categoria(3, 'Limpeza'),
      new Categoria(4, 'Diversos')
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.produto = new Produto();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadProdutoPage');
  }

  save() {
    //this.produto.dtpublicacao = new Date(); deixar q o servidor controla essa data
  }
}