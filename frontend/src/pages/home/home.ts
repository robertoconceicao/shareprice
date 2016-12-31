import { Component     }  from '@angular/core';
import { NavController }  from 'ionic-angular';
import { FiltrosPage }         from '../filtros/filtros';
import { CadProdutoPage } from '../cad-produto/cad-produto';
import { ConfigPage } from '../config/config';

import { Produto } from '../../models/produto';
import { SharingService } from '../../providers/sharing-service';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home {

   public searchTerm: string = "";
   public produtos: Array<Produto>; 
   
   constructor(public navCtrl: NavController, public sharingService: SharingService) {
       sharingService.findProdutos("").subscribe(dados => {
            this.produtos = dados;
            console.log(this.produtos);
        });
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

   isEmpty(){
       if(!!this.produtos){
          return this.produtos.length == 0;
       }
       return true;
   }
}