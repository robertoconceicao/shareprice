import { Component     }  from '@angular/core';
import { NavController }  from 'ionic-angular';
import { FiltrosPage }         from '../filtros/filtros';
import { CadProdutoPage } from '../cad-produto/cad-produto';
import { ConfigPage } from '../config/config';

import { Produto } from '../../models/produto';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home {

   public searchTerm: string = "";
   public produtos: Array<Produto>; 
   constructor(public navCtrl: NavController) {
   }

   filterItems(){

   }

   showFilters(){
      this.navCtrl.push(FiltrosPage);
   }

   showConfig(){
      this.navCtrl.push(ConfigPage);
   }
   
   newProduto(){       
       this.navCtrl.push(CadProdutoPage);
   }
}