export class Unidademedida {
    codigo: number;
    descricao: string;
    sigla: string;

    constructor(codigo?:number, descricao?:string, sigla?: string){
        if(!!codigo){
            this.codigo = codigo;
        }
        if(!!descricao) {
            this.descricao = descricao;
        }
        if(!!sigla){
            this.sigla = sigla;
        }
    }
}