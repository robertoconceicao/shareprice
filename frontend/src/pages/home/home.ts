import { Component, OnInit     }  from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, LoadingController }  from 'ionic-angular';
import { FiltrosPage }         from '../filtros/filtros';
import { CadProdutoPage } from '../cad-produto/cad-produto';
import { ConfigPage } from '../config/config';
import { Produto } from '../../models/produto';
import { Filtro } from '../../models/filtro';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';
import { Geolocation } from 'ionic-native';

import { Observable } from 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home implements OnInit {

   public searchTerm: string = "";
   public produtos: Array<Produto>;
   public noFilter: Array<Produto> = [];
   public loading: any;
   public searchTermControl;
   public lat: any;
   public lng: any;
   public filtro: Filtro;

   constructor(public navCtrl: NavController,
               public sharingService: SharingService,
               public loadingCtrl: LoadingController) {
     
     sharingService.filtro.subscribe(filtrosDados => {
         this.filtro = filtrosDados;
     });

     this.searchTermControl = new FormControl();
     this.searchTermControl.valueChanges
         .debounceTime(1000)
         .distinctUntilChanged()
         .subscribe(search => {
            //if (search !== '' && search) {
            //if (search) {
                this.searchTerm = search;
                this.filterItems();
            //}
        });
   }

   ngOnInit(){
       console.log("OnInit HomePage");
       
   }

   ionViewWillEnter() {
       console.log("ionViewWillEnter HomePage");
       this.carregandoPage();
   }

   carregandoPage(){
       this.loading = this.loadingCtrl.create({
            content: 'Carregando informações...'
        });

        this.loading.present();
        //pega as lojas pela localizacao do usuario
        Geolocation.getCurrentPosition()
            .then((resp) => {
                this.lat = resp.coords.latitude;
                this.lng = resp.coords.longitude;

                console.log("lat: "+this.lat+" lng: " +this.lng);
                this.findProdutos();            
            }).catch((error) => {
                console.log('Error getting location', error);
                this.loading.dismiss();            
            });
   }

   getFiltroOrAtualiza(){        
        if(!!this.filtro){
            this.filtro = new Filtro();
            this.filtro.distancia = 1;
        }
        this.filtro.lat = this.lat;
        this.filtro.lng = this.lng;
        this.sharingService.setFiltro(this.filtro);
        return this.filtro;
   }

   findProdutos(){
       let filtro = this.getFiltroOrAtualiza();
       this.sharingService.findProdutos(filtro)
       .then(dados => {
           this.produtos = new Array();
            for(let data of dados){
                var produto = AppSettings.convertToProduto(data);
                this.produtos.push(produto);
            }
            
            this.noFilter = this.produtos;
            this.loading.dismiss();
        })
        .catch(error => {
            console.log("Erro ao buscar os produtos")
            this.loading.dismiss();
        });
   }

   filterItems(){
      let filtro = this.getFiltroOrAtualiza();      
      filtro.searchTerm = this.searchTerm;
      
      this.sharingService.filterItems(filtro)
        .then(dados => {
            let arrayDados = new Array();

            for(let data of dados){
                var produto = AppSettings.convertToProduto(data);
                arrayDados.push(produto);
            }

            this.noFilter = arrayDados;                
            this.produtos = this.noFilter;
        })
        .catch(error => {
            console.log("Erro ao buscar filterItems");        
        });
   }

   showFilters(){
      this.navCtrl.push(FiltrosPage);
   }

   showConfig(){
      this.navCtrl.push(ConfigPage);
   }

   newProduto(){
       this.navCtrl.push(CadProdutoPage);
   }

   isEmpty(){
       if(!!this.produtos){
          return this.produtos.length == 0;
       }
       return true;
   }

   hasFilter(){
       return (!!this.filtro.marca || !!this.filtro.medida || !!this.filtro.tipo || !!this.filtro.maxvalor || this.filtro.distancia > 1);
   }

   doRefresh(refresher) { 
        let filtro = this.getFiltroOrAtualiza();
        filtro.posicao = 0;
        this.sharingService.beforeProdutos(filtro)
        .then(dados => {
            let arrayDados = new Array();
                for(let data of dados){
                    var produto = AppSettings.convertToProduto(data);
                    arrayDados.push(produto);
                }

                this.noFilter = arrayDados.concat(this.noFilter);
                refresher.complete();
            })
            .catch(error => {
                console.log("Erro ao buscar os produtos")
                refresher.complete();
            });   
   } 

   doInfinite(infiniteScroll) { 
        let filtro = this.getFiltroOrAtualiza();
        filtro.posicao = this.produtos.length; 
        this.sharingService.afterProdutos(filtro)
       .then(dados => {
            for(let data of dados){
                var produto = AppSettings.convertToProduto(data);
                this.produtos.push(produto);
            }
            this.noFilter = this.produtos;
            infiniteScroll.complete();  
        })
        .catch(error => {
            console.log("Erro ao buscar os produtos")
            infiniteScroll.complete();
        });
   }  
}