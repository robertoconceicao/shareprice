import { Component, Input } from '@angular/core';
import { Produto } from '../models/produto';
import { NavController }  from 'ionic-angular';
import { ViewProdutoPage } from '../pages/produto/view-produto';
import { NumberUtil } from '../util/number-util';

@Component({
    selector: 'produto-item',
    template: `
        <button ion-item (click)="itemSelected()">
            <img-loader item-left [src]="pathImagem()">
            </img-loader>
            <h3>{{ produto.marca.descricao + ' ' + produto.medida.descricaoML }}</h3>
            <p>{{ produto.loja.nome }}</p>
            <span class="dtpublicacaoClass">publicado em: {{ produto.dtpublicacao | date: 'dd/MM/yyyy' }}</span>
            <ion-note item-right>
              <preco-comp [preco]="produto.preco" [ml]="produto.medida.ml"></preco-comp>
            </ion-note>            
        </button>
    `,
    styles: [`       
        .dtpublicacaoClass {
            font-size: 0.7em;
            color: #666666 !important;             
        }     
    `]
})
export class ProdutoItem {
   @Input() produto: Produto;
   
   constructor(public navCtrl: NavController) { }
    
   itemSelected(){
       this.navCtrl.push(ViewProdutoPage, {produto: this.produto});
   }

   precoPorlitro(){
       return NumberUtil.calculaPrecoPorlitro(this.produto.medida.ml, this.produto.preco);
   }

   pathImagem(){
       return "http://geladasoficial.com/images/"+this.produto.marca.cdmarca+"/"+this.produto.tipo.cdtipo+"/"+this.produto.medida.cdmedida+".png";
   }
}