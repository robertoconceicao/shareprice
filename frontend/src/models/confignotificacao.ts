export class Confignotificacao{

    public cdconfignotificacao: number; 
    public cdusuario: string;
    public raio: number;
    public flnotificar: number;
    public marcas: Array<number>;
    //public tipos: Array<number>;
    //public medidas: Array<number>;
    
    constructor(){
        this.marcas = new Array();
      //  this.tipos = new Array();
      //  this.medidas = new Array();
    }
}