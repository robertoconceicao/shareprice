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
       this.sharingService.filtro.subscribe(filtrosDados => {
           console.log("Evento filtro HOME");
           this.filtro = filtrosDados;
       });

       this.sharingService.lat.subscribe(lat=>{
          this.lat = lat;
       });

       this.sharingService.lat.subscribe(lng=>{
          this.lng = lng;
       });
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
        this.filtro.lat = this.lat;
        this.filtro.lng = this.lng;
        console.log("lat: "+this.lat+" lng: " +this.lng);

        this.sharingService.setFiltro(this.filtro);
        this.findProdutos();
   }

   findProdutos(){       
       this.sharingService.findProdutos(this.filtro)
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
      this.filtro.searchTerm = this.searchTerm;      
      this.sharingService.filterItems(this.filtro)
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
        this.filtro.posicao = 0;
        this.sharingService.beforeProdutos(this.filtro)
        .then(dados => {
            let arrayDados = new Array();
                for(let data of dados){
                    var produto = AppSettings.convertToProduto(data);
                    arrayDados.push(produto);
                }

                //this.noFilter = arrayDados.concat(this.noFilter);
                this.noFilter = arrayDados;
                refresher.complete();
            })
            .catch(error => {
                console.log("Erro ao buscar os produtos")
                refresher.complete();
            });   
   } 

   doInfinite(infiniteScroll) {
        this.filtro.posicao = this.produtos.length; 
        this.sharingService.afterProdutos(this.filtro)
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