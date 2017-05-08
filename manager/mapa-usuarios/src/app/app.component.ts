import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { GeladasService } from './geladas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // google maps zoom level
  zoom: number = 8;
  
  // initial center position for the map
  lat: number = -27.6210716;
  lng: number = -48.6739947;
  radius: number = 50000;
	qtdeUsuario: number;

  usuarios: marker[];
	lojas: marker[];
	iconLoja: string = "/assets/icon/supermarket.png";
	iconUsuario: string = "/assets/icon/user.png";
	flUsuario: boolean = false;
	
	operador: any;

	constructor(public gService: GeladasService){
		this.buscaQtdeUsuario(this.lat, this.lng);
		this.buscaLojas(this.lat, this.lng);

		this.buscaDadosUsuario(this.lat, this.lng);
		this.operador = {
			lat: -27.6210716,
			lng: -48.6739947,
			label: 'Eu'		
		};
	}

	buscaDadosUsuario(lat: any, lng: any){
		if(this.flUsuario){
			this.gService.getUserNoRaio(lat, lng, this.radius)
				.then((dados) => {
					this.usuarios = dados;
					this.lat = lat;
					this.lng = lng;
				}).catch((error) => {
					console.log("Error: "+error);
				});
		}
	}

	buscaQtdeUsuario(lat: any, lng: any){
		this.gService.getQtdeUserNoRaio(lat, lng, this.radius)
			.then((dados) => {
				this.qtdeUsuario = dados[0].qtde;
			}).catch((error) => {
				console.log("Error: "+error);
			});
	}

	buscaLojas(lat: any, lng: any){
		this.gService.getLojas(lat, lng, this.radius)
			.then((dados) => {
				this.lojas = dados;				
			}).catch((error) => {
				console.log("Error: "+error);
			});
	}
	
  onChangedRadius($event) {
    this.radius = $event;
		this.buscaQtdeUsuario(this.lat, this.lng);
		this.buscaDadosUsuario(this.lat, this.lng);
		this.buscaLojas(this.lat, this.lng);
  }

  eventoDragEnd($event: MouseEvent) {    		
		this.buscaDadosUsuario($event['coords'].lat, $event['coords'].lng);
		this.buscaQtdeUsuario($event['coords'].lat, $event['coords'].lng);		
		this.buscaLojas($event['coords'].lat, $event['coords'].lng);
  }

	operadorDragEnd($event: MouseEvent) {
		console.log("operadorDragEnd: ", $event['coords'].lat, $event['coords'].lng);
	}
}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label: string;
	icon?: string;
}