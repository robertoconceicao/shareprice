import { Component, OnInit, Input }  from '@angular/core';
import { Http } from '@angular/http';
import { FormControl } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';
import { CodigoDescricao, Municipio } from '../../models';
import { NavController }  from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';

@Component({
   selector: 'page-local',
   template: `
        <searchlist *ngIf="listaMunicipio"
                [selected]="municipio" 
                [lista]="listaMunicipio" 
                (onSelected)="onNotifyLocal($event)" 
                [showButtonAdd]="false"
                [icon]="icon"
                [placeholder]="placeholder"></searchlist>
   `
})
export class LocalusuarioPage implements OnInit {
    public icon: string = "compass";
    public municipio: Municipio;
    public listaMunicipio: CodigoDescricao[];
    public placeholder: string = "Informe o nome da cidade"; 
    public municipios: Array<Municipio>;

    constructor( private _http: Http,
                 public navCtrl: NavController,
                 public navParams: NavParams,
                 public viewCtrl: ViewController,
                 public sharingService: SharingService){
    }

    ngOnInit(): void {
        this.sharingService.municipios
            .map( lista => {
                    this.municipios = lista;
                    var dados = [];
                    for(let m of lista){
                        dados.push({"codigo": m.cdIbge, "titulo":"", "descricao": m.municipio + ", "+m.uf});
                    }
                    return dados;
            }).subscribe(x => this.listaMunicipio = x );
    }

    onNotifyLocal(localSelc: CodigoDescricao):void {
        console.log("onNotifyLocal:", localSelc);
        this.municipio = this.municipios.filter(x => x.cdIbge === localSelc.codigo)[0];
        this.sharingService.setLat(this.municipio.lat);
        this.sharingService.setLng(this.municipio.lng);
        this.viewCtrl.dismiss(this.municipio);
    }
}