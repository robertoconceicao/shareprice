import { Loja } from '../models/loja';

export class Produto {
    codigo: number;    
    descricao: string;
    quantidade: number;
    preco: number;
    loja: Loja;
    cdCategoria: number;
    cdUnidademedida: number;
    dtpromocao: Date;
    dtpublicacao: Date;

    constructor(){        
        this.loja = new Loja();        
        this.dtpromocao = new Date();
    }
}