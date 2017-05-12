import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { GeladasService } from './geladas.service';

interface marker {
	lat: number;
	lng: number;
	label: string;
	icon?: string;
	cdloja?: string;
}

interface Produto {
	codigo: number;
	cdloja: string;
	cdtipo: number;
	cdmarca: number;
	cdmedida: number;
	preco: string;
	dtpublicacao: Date;
	icon: string;
	cdusuario: string;
}

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
	flUsuario: boolean = false;

	produto: Produto;
	marcas: any[];
	medidas: any[];
	tipos: any[];
	msg: string;

	loja: marker;

	constructor(public gService: GeladasService) {
		if (this.flUsuario) {
			this.buscaDadosUsuario(this.lat, this.lng);
		}
		this.buscaQtdeUsuario(this.lat, this.lng);
		this.buscaLojas(this.lat, this.lng);

		this.newProduto();

		this.msg = "";
		
		this.loja = {
			lat: 0,
			lng: 0,
			label: "",
			icon: "",
			cdloja: ""
		};
	}

	newProduto(){
		this.produto = {
			codigo: 0,
			cdloja: '',
			cdtipo: 1,
			cdmarca: 1,
			cdmedida: 1,
			preco: '',
			dtpublicacao: null,
			icon: '',
			cdusuario: '395753717458940'//'115862700861296845675'
		};
	}

	buscaDadosUsuario(lat: any, lng: any) {		
		if (this.flUsuario) {
			this.gService.getUserNoRaio(lat, lng, this.radius)
				.then((dados) => {
					this.usuarios = dados;
					this.lat = lat;
					this.lng = lng;
				}).catch((error) => {
					console.log("Error: " + error);
				});		
		}
	}

	buscaQtdeUsuario(lat: any, lng: any) {
		this.gService.getQtdeUserNoRaio(lat, lng, this.radius)
			.then((dados) => {
				this.qtdeUsuario = dados[0].qtde;
			}).catch((error) => {
				console.log("Error: " + error);
			});
	}

	buscaLojas(lat: any, lng: any) {
		this.gService.getLojas(lat, lng, this.radius)
			.then((dados) => {
				this.lojas = dados;
				console.log("lojas: ", dados);
			}).catch((error) => {
				console.log("Error: " + error);
			});
	}

	onClickLoja(_loja) {
		this.loja = _loja;
	}

	onChangedRadius($event) {
		this.radius = $event;
		this.buscaLojas(this.lat, this.lng);
		this.buscaQtdeUsuario(this.lat, this.lng);		
		this.buscaDadosUsuario(this.lat, this.lng);		
	}

	eventoDragEnd($event: MouseEvent) {
		this.buscaLojas($event['coords'].lat, $event['coords'].lng);		
		this.buscaDadosUsuario($event['coords'].lat, $event['coords'].lng);
		this.buscaQtdeUsuario($event['coords'].lat, $event['coords'].lng);		
	}

	postar(): void {
		this.produto.preco = this.produto.preco.replace(/,/, '.');
		this.produto.cdloja = this.loja.cdloja;
		this.gService.postar(this.produto)
			.then(success => {
				this.showAlert("Obrigado por cadastrar o produto");
				this.newProduto();
			})
			.catch(error => {
				this.showAlert("Erro ao conectart com o servidor, favor tentar mais tarde.");
			});
	}

	showAlert(text) {
		this.msg = text;
		setTimeout(function () {
			this.msg = "";
		}, 1000);
	}
}