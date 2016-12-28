import { Component     }  from '@angular/core';
import { NavController }  from 'ionic-angular';
import { FiltrosPage }         from '../filtros/filtros';
import { CadProdutoPage } from '../cad-produto/cad-produto';
@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home {

   searchTerm: string = "";

   constructor(public navCtrl: NavController) {
   }

   filterItems(){

   }

   showFilters(){
      this.navCtrl.push(FiltrosPage);
   }

   showConfig(){
      this.navCtrl.push(CadProdutoPage);
   }
}