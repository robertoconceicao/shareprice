import { Component     }  from '@angular/core';
import { NavController, LoadingController }  from 'ionic-angular';
import { FiltrosPage }         from '../filtros/filtros';
import { CadProdutoPage } from '../cad-produto/cad-produto';
import { ConfigPage } from '../config/config';
import { Produto } from '../../models/produto';
import { Filtro } from '../../models/filtro';
import { SharingService } from '../../providers/sharing-service';
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

   constructor(public navCtrl: NavController,
               public sharingService: SharingService,
               public loadingCtrl: LoadingController) {
     this.meuEstorage = new MeuEstorage(sharingService);

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

   itemSelected(codigoParam){
       console.log("codigo: "+codigoParam);
       this.navCtrl.push(CadProdutoPage, {codigo: codigoParam});
   }

   /**
    * loja: Loja; vicinity
    tipo: Tipo;
    marca: Marca;
    medida: Medida;
    preco: string;
    */
   filterItems(){
      this.produtos = this.noFilter.filter((item) => {
          let searchComposto = item.loja.nome + " " +item.marca.descricao + " " +item.medida.descricao + " " +item.medida.ml;
          return searchComposto.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1;
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
