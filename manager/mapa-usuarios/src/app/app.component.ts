import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { GeladasService } from './geladas.service';

const MSG_ERROR = 0;
const MSG_SUCCESS = 1;

interface marker {
	lat: number;
	lng: number;
	label: string;
	icon?: string;
	cdloja?: string;
}

interface Municipio {
	cdIbge: number;
	municipio: string;
	cduf: number;
	uf: string;
	estado: string;
	lat: number;
	lng: number;
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

interface DadoProduto {	
	marca: string;
	medida: string;
	ml: string;
	loja: string;
	preco: string;
	dtpublicacao: Date;
	nomeusuario: string;
	lat: number;
	lng: number;
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
	municipios: Municipio[];
	produtos: DadoProduto[];

	iconLoja: string = "/assets/icon/supermarket.png";
	iconProduto: string = "/assets/icon/beer.png";	

	flUsuario: boolean = false;
	flLocal: boolean = false;
	flProduto: boolean = false;
	flMunicipios: boolean = false;

	produto: Produto;
	marcas: any[];
	medidas: any[];
	tipos: any[];
	msg: string;
	error: string;

	filtro: any;

	loja: marker;

	constructor(public gService: GeladasService) {
		this.buscaDadosUsuario(this.lat, this.lng);
		this.buscaQtdeUsuario(this.lat, this.lng);
		this.buscaLojas(this.lat, this.lng);
		this.buscaProdutos(this.lat, this.lng);
		this.buscaMunicipios();

		this.msg = "";
		this.error = "";

		this.loja = {
			lat: 0,
			lng: 0,
			label: "",
			icon: "",
			cdloja: ""
		};

		this.filtro = "";

		this.newProduto();
	}

	newProduto(){
		this.produto = {
			codigo: 0,
			cdloja: this.loja.cdloja,
			cdtipo: 1,
			cdmarca: 1,
			cdmedida: 19,
			preco: '',
			dtpublicacao: null,
			icon: '',
			cdusuario: '395753717458940'//'115862700861296845675'
		};
	}

	buscaMunicipios(){
		if(this.flMunicipios) {
			this.gService.municipios
			.map( lista => {
                    return lista;
            }).subscribe(x => this.municipios = x );
		}
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
		} else {
			this.usuarios = new Array();
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

	btBuscaLojas(){
		this.buscaLojas(this.lat, this.lng);
	}

	buscaLojas(lat: any, lng: any) {
		if(this.flLocal){
			console.log("BuscaLojas: ", lat, lng, this.radius);
			if(!!this.filtro){
				this.gService.getLojasByName(this.filtro, lat, lng, this.radius)
					.then((dados) => {
						this.lojas = dados;
						console.log("lojas: ", dados);
					}).catch((error) => {
						console.log("Error: " + error);
					});
			} else {
				this.gService.getLojas(lat, lng, this.radius)
					.then((dados) => {
						this.lojas = dados;
						console.log("lojas: ", dados);
					}).catch((error) => {
						console.log("Error: " + error);
					});
			}
		} else {
			this.lojas = new Array();
			this.filtro = "";
		}
	}

	buscaProdutos(lat: any, lng: any) {
		if(this.flProduto){
			this.gService.getProdutos(lat, lng, this.radius)
				.then((dados) => {
					this.produtos = dados;
				}).catch((error) => {
					console.log("Error: " + error);
				});
		} else {
			this.produtos = new Array();
		}
	}

	onClickLoja(_loja) {
		this.loja = _loja;
	}

	onChangedRadius($event) {
		this.radius = $event;
		this.buscaLojas(this.lat, this.lng);
		this.buscaQtdeUsuario(this.lat, this.lng);		
		this.buscaDadosUsuario(this.lat, this.lng);	
		this.buscaProdutos(this.lat, this.lng);	
	}

	eventoDragEnd($event: MouseEvent) {
		this.buscaLojas($event['coords'].lat, $event['coords'].lng);		
		this.buscaDadosUsuario($event['coords'].lat, $event['coords'].lng);
		this.buscaQtdeUsuario($event['coords'].lat, $event['coords'].lng);	
		this.buscaProdutos($event['coords'].lat, $event['coords'].lng);	
	}

	postar(): void {
		this.produto.preco = this.produto.preco.replace(/,/, '.');
		this.produto.cdloja = this.loja.cdloja;
		this.gService.postar(this.produto)
			.then(success => {
				this.showAlert("Obrigado por cadastrar o produto", MSG_SUCCESS);
				this.newProduto();
			})
			.catch(error => {
				this.showAlert("Erro ao cadastrar produto, tentar mais tarde.", MSG_ERROR);
			});
	}

	showAlert(text, tipo) {
		if(tipo == MSG_ERROR){
			this.error = text;
		} else {
			this.msg = text;
		}
		
		let self = this;
		setTimeout(function () {
			self.msg = "";
			self.error = "";
		}, 3000);
	}
}