import { SharingService } from '../services/sharing-service';
import { Filtro } from '../models/filtro';

export const FILTRO = "br.com.rdc.filtro_cerveja";
export const MARCAS = "br.com.rdc.marcas_cerveja";
export const TIPOS  = "br.com.rdc.tipos_cerveja";
export const MEDIDAS = "br.com.rdc.medidas_cerveja";

export class MeuEstorage {    

    sharingService: SharingService;

    constructor(sharingService: SharingService){
        this.sharingService = sharingService;
    }

    
    loadStorage(){
        console.log("clear localStorage ...");
    } 
    
    getFiltro(){
        let filtroLS = localStorage.getItem(FILTRO);
        if(!!filtroLS){
            let obj = JSON.parse(filtroLS);
            let filtro = new Filtro();
            filtro.marca = obj.marca;
            filtro.tipo = obj.tipo;
            filtro.medida = obj.medida;
            filtro.maxvalor = obj.maxvalor;
            filtro.distancia = obj.distancia;
            filtro.posicao = obj.posicao;
            return filtro;
        }
        return null;
    }

    setFiltro(filtro: Filtro){
        localStorage.setItem(FILTRO, JSON.stringify(filtro));
    }

    removeItem(item){
        localStorage.removeItem(item);
    } 
}