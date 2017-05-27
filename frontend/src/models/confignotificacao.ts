export class Confignotificacao{

    public cdconfignotificacao: number; 
    public cdusuario: string;
    public raio: number;
    public flnotificar: number;
    public flemail: number;
    public marcas: Array<number>;
    
    constructor(){
        this.marcas = new Array();    
    }
}