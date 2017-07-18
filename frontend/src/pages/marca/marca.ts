import { Component, OnInit }  from '@angular/core';
import { Http } from '@angular/http';
import { FormControl } from '@angular/forms';
import { CodigoDescricao, Marca } from '../../models';
import { NavController }  from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';

@Component({
   selector: 'page-marca',
   templateUrl: 'marca.html'
})
export class MarcaPage implements OnInit {
    

    marca: CodigoDescricao;
    listaMarcas: CodigoDescricao[];
    public placeholder: string = "Informe uma marca"; 

    constructor( private _http: Http,
        public navCtrl: NavController,
               public sharingService: SharingService){
        
    }

    ngOnInit(): void {
        this.marca = {'codigo': 1, 'descricao': "Skol"};

           // this.converteCodigoDescricao(marcas);
        this.sharingService.marcas
            .map( x => {
                    var dados = [];
                    for(let m of x){
                        dados.push({"codigo": m.cdmarca, "descricao": m.descricao});
                    }
                    return dados;
            })
            .subscribe(x => this.listaMarcas = x );
        
   //     subscribe(x => this.listaMarcas = x);
   //     this.getMarcas()
   //         .subscribe(x => this.listaMarcas = x );        
    }

    onNotifyMarca(marcaSelc: CodigoDescricao):void {
        console.log("marca selecionada: ", marcaSelc);
        this.marca = marcaSelc;
    }
/*
    getMarcas(){
        const url = 'assets/mock-marcas.json';
        return this._http.get(url)
                         .map(x => x.json());
    }
*/
    converteCodigoDescricao(marcas: Array<Marca>){
        let codigoDescricao: CodigoDescricao;
        for(let m of marcas){
            codigoDescricao = new CodigoDescricao();
            codigoDescricao.codigo = m.cdmarca;
            codigoDescricao.descricao = m.descricao;
            this.listaMarcas.push(codigoDescricao);
        }
    }
}