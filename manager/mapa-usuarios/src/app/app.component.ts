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

  markers: marker[];

	constructor(public gService: GeladasService){
		this.buscaDadosUsuario(this.lat, this.lng);
	}

	buscaDadosUsuario(lat: any, lng: any){
		this.gService.getUserNoRaio(lat, lng, this.radius)
			.then((dados) => {
				this.markers = dados;
				this.lat = lat;
				this.lng = lng;
			}).catch((error) => {
				console.log("Error: "+error);
			});
	}
	
  onChangedRadius($event) {
    this.radius = $event;
		this.buscaDadosUsuario(this.lat, this.lng);
  }

  eventoDragEnd($event: MouseEvent) {
    console.log('eventoDragEnd', $event);		
		this.buscaDadosUsuario($event['coords'].lat, $event['coords'].lng);		
  }
}

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;	
}