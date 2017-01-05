export class Produto {
    codigo: number;    
    descricao: string;
    quantidade: number;
    preco: number;
    cdloja: string;
    cdcategoria: number;
    cdunidademedida: number;
    dtpromocao: Date;
    dtpublicacao: Date;

    constructor(){
        this.dtpromocao = new Date();
    }
}