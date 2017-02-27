import { Component, Input } from '@angular/core';
import { Produto } from '../models/produto';
import { NavController }  from 'ionic-angular';
import { CadProdutoPage } from '../pages/cad-produto/cad-produto';

@Component({
    selector: 'produto-item',
    template: `
        <button ion-item (click)="itemSelected()">
            <ion-thumbnail item-left>
                <img [src]="produto.icon">
            </ion-thumbnail>
            <h2>{{ produto.marca.descricao + ' ' + produto.medida.descricaoML }}</h2>
            <p>{{ produto.loja.nome }}</p>
            <p>{{ produto.dtpublicacao | date: 'dd/MM/yyyy' }}</p>
            <ion-note item-right>
              R$ {{produto.preco | moedaReal }}
            </ion-note>            
        </button>
    `,
    styles: [`
        ion-note {  
            font-size: 1.0em;  
            color: dodgerblue !important; 
            margin-top: 14px;
        }
    `]
})
export class ProdutoItem {
   @Input() produto: Produto;

   constructor(public navCtrl: NavController) { }
    
   itemSelected(){
       this.navCtrl.push(CadProdutoPage, {codigo: this.produto.codigo});
   }
}