import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Produto }          from '../../models/produto';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';


declare var google;

@Component({
    selector: 'mapa-comp',
    templateUrl: './mapa.html'
})
export class MapaPage {

    @ViewChild('map') mapElement: ElementRef;
    map: any;

    public produto: Produto;
    public codigo: any;

    constructor(public navParams: NavParams,
                public sharingService: SharingService){
        this.produto = new Produto();            
        this.codigo = this.navParams.get('codigo');        
        console.log("CODIGO: "+this.codigo);
        this.sharingService.findProdutoById(this.codigo)
            .then(produto => {
                this.produto = AppSettings.convertToProduto(produto[0]);
                this.loadMap();
            })
            .catch(error => {
            
            });
    }

    loadMap(){
        console.log("loadMap ... "+this.produto.loja.lat+" lng: "+this.produto.loja.lng);
        Geolocation.getCurrentPosition().then((position) => { 
            let latLng = new google.maps.LatLng(this.produto.loja.lat, this.produto.loja.lng); 
            let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
        
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        
            }, (err) => {
            console.log(err);
        });
    }
}