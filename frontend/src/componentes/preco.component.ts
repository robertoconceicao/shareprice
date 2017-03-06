import { Component, Input } from '@angular/core';
import { NumberUtil } from '../util/number-util';

@Component({
    selector: 'preco-comp',
    template: `
        <span class="preco"> R$ {{preco | moedaReal }} </span>
        <br>
        <span class="preco_litro">preço p/ litro: {{precoPorlitro()}}</span>
    `,
    styles: [`       
        .preco_litro {
            font-size: 0.6em;
            color: #666666 !important; 
        }
        .preco {
            font-size: 0.9em;  
            color: dodgerblue !important; 
            margin-top: 14px;
            text-align: right;
        }
    `]
})
export class PrecoComponent{
    @Input() preco: any = 0;
    @Input() ml: any = 0;

    precoPorlitro(){
       return NumberUtil.calculaPrecoPorlitro(this.ml, this.preco);
    }
}