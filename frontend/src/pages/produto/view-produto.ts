import { Component, Input } from '@angular/core';
import { Produto }          from '../../models/produto';

@Component({
    selector: 'view-produto',
    templateUrl: 'view-produto.html'
})
export class ViewProdutoPage {

    @Input() produto: Produto;

    constructor(){}

}