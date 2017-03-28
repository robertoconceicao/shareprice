export class Confignotificacao{

    public cdconfignotificacao: number; 
    public cdusuario: string;
    public raio: number;
    public tipos: Array<number>;
    public marcas: Array<number>;
    public medidas: Array<number>;
    
    constructor(){
        this.tipos = new Array();
        this.marcas = new Array();
        this.medidas = new Array();
    }
}