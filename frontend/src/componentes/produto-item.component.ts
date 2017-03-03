import { Component, Input } from '@angular/core';
import { Produto } from '../models/produto';
import { NavController }  from 'ionic-angular';
//import { CadProdutoPage } from '../pages/cad-produto/cad-produto';
import { ViewProdutoPage } from '../pages/produto/view-produto';
import { NumberUtil } from '../util/number-util';

@Component({
    selector: 'produto-item',
    template: `
        <button ion-item (click)="itemSelected()">
            <ion-thumbnail item-left>
                <img [src]="produto.icon">
            </ion-thumbnail>
            <h3>{{ produto.marca.descricao + ' ' + produto.medida.descricaoML }}</h3>
            <p>{{ produto.loja.nome }}</p>
            <p>{{ produto.dtpublicacao | date: 'dd/MM/yyyy' }}</p>
            <ion-note item-right>
              <span> R$ {{produto.preco | moedaReal }} </span>
              <br>
              <span class="preco_litro">preço p/ litro: {{precoPorlitro()}}</span>
            </ion-note>            
        </button>
    `,
    styles: [`
        ion-note {  
            font-size: 0.9em;  
            color: dodgerblue !important; 
            margin-top: 14px;
            text-align: right;
        }

        .preco_litro {
            font-size: 0.6em;
            color: #666666 !important; 
        }
    `]
})
export class ProdutoItem {
   @Input() produto: Produto;

   constructor(public navCtrl: NavController) { }
    
   itemSelected(){
       //this.navCtrl.push(CadProdutoPage, {codigo: this.produto.codigo});
       this.navCtrl.push(ViewProdutoPage, {codigo: this.produto.codigo});
   }

   precoPorlitro(){
       return NumberUtil.calculaPrecoPorlitro(this.produto.medida.ml, this.produto.preco);
   }
}