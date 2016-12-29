export class Unidademedida {
    codigo: number;
    descricao: string;
    sigla: string;

    constructor(codigo?:number, descricao?:string, sigla?: string){
        this.codigo = codigo;
        this.descricao = descricao;
        this.sigla = sigla;
    }
}