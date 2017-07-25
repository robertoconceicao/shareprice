import { Component, OnInit, Input }  from '@angular/core';
import { Http } from '@angular/http';
import { FormControl } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';
import { CodigoDescricao, Marca } from '../../models';
import { NavController }  from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { IndiqueMarcaPage } from '../../pages';

@Component({
   selector: 'page-marca',
   template: `
        <searchlist *ngIf="listaMarcas"
                [selected]="marca" 
                [lista]="listaMarcas" 
                (onSelected)="onNotifyMarca($event)" 
                (onAdd)="onClickAdd($event)"
                [showButtonAdd]="true"
                [icon]="iconBeer"
                [placeholder]="placeholder"></searchlist>
   `
})
export class MarcaPage implements OnInit {

    @Input() selected: CodigoDescricao;
    public iconBeer: string = "beer";
    public marca: CodigoDescricao;
    public listaMarcas: CodigoDescricao[];
    public placeholder: string = "Informe uma marca"; 

    constructor( private _http: Http,
                 public navCtrl: NavController,
                 public navParams: NavParams,
                 public viewCtrl: ViewController,
                 public sharingService: SharingService){

        this.converteCodigoDescricao(this.navParams.get('marcas'));
    }

    ngOnInit(): void {
        /*
        this.sharingService.marcas
            .map( x => {
                    var dados = [];
                    for(let m of x){
                        dados.push({"codigo": m.cdmarca, "titulo": m.descricao, "descricao": ""});
                    }
                    return dados;
            })
            .subscribe(x => this.listaMarcas = x );
        */
    }

    onNotifyMarca(marcaSelc: CodigoDescricao):void {
        this.marca = marcaSelc;
        this.viewCtrl.dismiss({"cdmarca": this.marca.codigo, "descricao": this.marca.descricao});
    }

    onClickAdd(event: Boolean) : void {
        this.navCtrl.push(IndiqueMarcaPage);
    }

    converteCodigoDescricao(marcas: Array<Marca>){
        this.listaMarcas = new Array<CodigoDescricao>();
        for(let m of marcas){
            this.listaMarcas.push({"codigo": m.cdmarca, "titulo": "", "descricao": m.descricao});
        }
    }
}