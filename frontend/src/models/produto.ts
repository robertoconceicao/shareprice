import { Marca }        from './marca';
import { Tipo }         from './tipo';
import { Medida }       from './medida';
import { Loja }         from './loja';
import { Usuario }      from './usuario';

export class Produto {
    codigo: number;
    loja: Loja;
    tipo: Tipo;
    marca: Marca;
    medida: Medida;
    preco: string;    
    dtpublicacao: Date;
    icon: string;
    usuario: Usuario;

    constructor(){
        this.loja = new Loja();
        this.tipo = new Tipo();
        this.marca = new Marca();
        this.medida = new Medida();
        this.preco = '0,00';        
        this.dtpublicacao = new Date();
        this.usuario = new Usuario();
    }
}