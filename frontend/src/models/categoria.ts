export class Categoria {
    codigo: number;
    descricao: string;
    icon: string;

    constructor(codigo?: number, descricao?: string, icon?: string){
        this.codigo = codigo;
        this.descricao = descricao;
        this.icon = icon;
    }
}