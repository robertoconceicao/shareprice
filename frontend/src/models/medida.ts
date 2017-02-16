export class Medida {
    cdmedida: number;
    descricao: string;    
    ml: number;

    get descricaoML(){
        return this.descricao +' '+ this.ml + ' ml';
    }
}