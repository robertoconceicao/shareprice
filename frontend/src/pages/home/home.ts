import { Component } from '@angular/core';
import { NavController }        from 'ionic-angular';
import { Busca }                from '../busca/busca';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home {
   constructor(public navCtrl: NavController) {
   }

   busca() :void{
       this.navCtrl.push(Busca);
   }
}