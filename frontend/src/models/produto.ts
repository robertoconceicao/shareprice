import { Categoria } from '../models/categoria';
import { Loja } from '../models/loja';
import { Unidademedida } from '../models/unidademedida';

export class Produto {
    codigo: number;
    categoria: Categoria;
    descricao: string;
    quantidade: number;
    preco: number;
    loja: Loja;
    unidademedida: Unidademedida;
    dtpromocao: Date;
    dtpublicacao: Date;

    constructor(){
        this.categoria = new Categoria();
        this.loja = new Loja();
        this.unidademedida = new Unidademedida();
        this.dtpromocao = new Date();
    }
}