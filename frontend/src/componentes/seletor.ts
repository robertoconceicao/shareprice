import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'seletor',
  templateUrl: 'seletor.html'
})
export class Seletor {

  public itens: Array<string>;
  public titulo: string;
  public searchItem: string;

  
  public itemSelecionado: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.titulo = navParams.get("titulo");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Seletor');
  }

  filterItens(){

  }

  selectItem(event){

  }
}