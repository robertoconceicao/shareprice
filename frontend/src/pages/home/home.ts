import { Component     }  from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, LoadingController }  from 'ionic-angular';
import { FiltrosPage }         from '../filtros/filtros';
import { CadProdutoPage } from '../cad-produto/cad-produto';
import { ConfigPage } from '../config/config';
import { Produto } from '../../models/produto';
import { Filtro } from '../../models/filtro';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';
import { MeuEstorage } from '../../app/meu-estorage';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home {

   public searchTerm: string = "";
   public produtos: Array<Produto>;
   public noFilter: Array<Produto> = [];
   public loading: any;
   public meuEstorage: MeuEstorage;
   public searchTermControl;


   constructor(public navCtrl: NavController,
               public sharingService: SharingService,
               public loadingCtrl: LoadingController) {
     this.meuEstorage = new MeuEstorage(sharingService);
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

/*
   ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.carregandoPage();
   }
*/

   ionViewWillEnter() {
       console.log("ionViewWillEnter HomePage");
       this.carregandoPage();
   }
   carregandoPage(){
       this.loading = this.loadingCtrl.create({
            content: 'Carregando informações...'
        });

        this.loading.present();
        this.findProdutos();
   }

   findProdutos(){
       let filtro = this.meuEstorage.getFiltro();
        if(filtro === null){
            filtro = new Filtro();
        }
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

   /**
    * loja: Loja; vicinity
    tipo: Tipo;
    marca: Marca;
    medida: Medida;
    preco: string;
    */
   filterItems(){    
      console.log("filterItems ...");
      let filtro = this.meuEstorage.getFiltro();
      if(filtro === null){
         filtro = new Filtro();
      }
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
       return !!this.meuEstorage.getFiltro();
   }

   doRefresh(refresher) { 
        let filtro = this.meuEstorage.getFiltro();
        if(filtro === null){
            filtro = new Filtro();
        }
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
        let filtro = this.meuEstorage.getFiltro();
        if(filtro === null){
            filtro = new Filtro();
        }
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
