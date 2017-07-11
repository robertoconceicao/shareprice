import { Component, OnInit }  from '@angular/core';
import { FormControl } from '@angular/forms';
import { CodigoDescricao, Marca } from '../../models';
import { NavController }  from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class MarcaPage {

    marca: CodigoDescricao;
    listaMarcas: Array<CodigoDescricao>;

    constructor(public navCtrl: NavController,
               public sharingService: SharingService){
        this.sharingService.marcas.subscribe(marcas => {
            this.converteCodigoDescricao(marcas);
        });
    }

    onNotifyMarca(marcaSelc: CodigoDescricao):void {
        console.log("marca selecionada: ", marcaSelc);
        this.marca = marcaSelc;
    }

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