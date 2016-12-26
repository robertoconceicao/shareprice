import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
 
@Component({
   selector: 'page-busca',
   templateUrl: 'busca.html'
})
export class Busca {
 
   public searchTerm: string = "";

   constructor(public navCtrl: NavController    ) {
       //console.log(this.barra);
       //this.barra.setFocus();
   }

   filterItems() {
    /*this.hasFilter = false;
    this.feeds = this.noFilter.filter((item) => {
        return item.data.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
    */
  }

}