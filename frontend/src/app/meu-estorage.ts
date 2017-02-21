import { SharingService } from '../providers/sharing-service';
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
        localStorage.clear();

        this.getMarcas();
        this.getTipos();
        this.getMedidas();
    } 

    getMarcas(){
        let marcasLS = localStorage.getItem(MARCAS);
        if(!!marcasLS){
            console.log("Pegando MARCAS do localStorage...");
            return JSON.parse(marcasLS);
        } else {
            //get marcas
            this.sharingService.getMarcas()
                .then(marcas => {              
                    localStorage.setItem(MARCAS, JSON.stringify(marcas));
                })
                .catch(error => { 
                    console.log("Erro ao buscar as Marcas");
                });
        }
    }

    getTipos(){
        let tiposLS = localStorage.getItem(TIPOS);
        if(!!tiposLS){
            console.log("Pegando TIPOS do localStorage...");
            return JSON.parse(tiposLS);
        } else {
            //get tipos
            this.sharingService.getTipos()
                .then(tipos => {
                    localStorage.setItem(TIPOS, JSON.stringify(tipos));                
                })
                .catch(error => {
                    console.log("Erro ao conectart com o servidor, favor tentar mais tarde.");                
                });
        }
    }

    getMedidas(){
        let medidasLS = localStorage.getItem(MEDIDAS);
        if(!!medidasLS){
            console.log("Pegando MEDIDAS do localStorage...");
            return JSON.parse(medidasLS);
        } else {
            //get medidas
            this.sharingService.getMedidas()
                .then(medidas => {
                    localStorage.setItem(MEDIDAS, JSON.stringify(medidas));                    
                })
                .catch(error => {
                    console.log("Erro ao conectart com o servidor, favor tentar mais tarde.");
                });
        }
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