import { Component, OnInit }  from '@angular/core';
import { Http } from '@angular/http';
import { FormControl } from '@angular/forms';
import { CodigoDescricao, Marca } from '../../models';
import { NavController }  from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { Home } from '../../pages';

@Component({
   selector: 'page-marca',
   templateUrl: 'marca.html'
})
export class MarcaPage implements OnInit {
    

    iconBeer: string = "beer";
    marca: CodigoDescricao;
    listaMarcas: CodigoDescricao[];
    public placeholder: string = "Informe uma marca"; 

    constructor( private _http: Http,
                 public navCtrl: NavController,
                 public sharingService: SharingService){
        
    }

    ngOnInit(): void {
        this.marca = {'codigo': 1, 'titulo':"Skol", 'descricao': ""};

        this.sharingService.marcas
            .map( x => {
                    var dados = [];
                    for(let m of x){
                        dados.push({"codigo": m.cdmarca, "titulo": m.descricao, "descricao": ""});
                    }
                    return dados;
            })
            .subscribe(x => this.listaMarcas = x );
    }

    onNotifyMarca(marcaSelc: CodigoDescricao):void {
        console.log("marca selecionada: ", marcaSelc);
        this.marca = marcaSelc;
    }

    onClickAdd(event: Boolean) : void {
        this.navCtrl.push(Home);
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