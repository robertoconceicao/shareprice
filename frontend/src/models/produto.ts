import { Marca }        from './marca';
import { Tipo }         from './tipo';
import { Medida }       from './medida';
import { Loja }         from './loja';

export class Produto {
    codigo: number;
    loja: Loja;
    tipo: Tipo;
    marca: Marca;
    medida: Medida;
    preco: number;    
    dtpublicacao: Date;
    icon: string;

    constructor(){
        this.loja = new Loja();
        this.tipo = new Tipo();
        this.marca = new Marca();
        this.medida = new Medida();
        this.preco = 0;        
        this.dtpublicacao = new Date();
    }
}