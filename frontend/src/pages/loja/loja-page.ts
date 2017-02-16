import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Loja } from '../../models/loja';

@Component({
    selector: 'loja-page',
    template: `
        <ion-content>
            <ion-navbar>
                <ion-searchbar 
                    [(ngModel)]="searchTerm" 
                    [showCancelButton]=true
                    (ionInput)="filterItems()" 
                    placeholder="Nome do supermercado" >
                </ion-searchbar>
            </ion-navbar>

            <ion-list>
                <button ion-item *ngFor="let loja of lojas" (click)="itemSelected(loja)">
                    <ion-icon name="basket" item-left large></ion-icon>
                    <h2>{{ loja.nome }}</h2>
                    <p>{{ loja.vicinity }}</p>                    
                </button>
            </ion-list>

            <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>        
        </ion-content>
    `
})

export class LojaPage {
  public lojas: Array<Loja> = [];
  public noFilter: Array<Loja> = [];
  public searchTerm: string = "";

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController) {
      this.lojas = this.navParams.get('lojas');
      this.noFilter = this.lojas;
  }

  itemSelected(loja){
    this.viewCtrl.dismiss(loja);
  }

  doInfinite(infiniteScroll) {
    infiniteScroll.complete();
  }

  filterItems() {
    this.lojas = this.noFilter.filter((item) => {
        return item.nome.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
}