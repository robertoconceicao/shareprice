import { Component     }  from '@angular/core';
import { NavController, LoadingController }  from 'ionic-angular';
import { FiltrosPage }         from '../filtros/filtros';
import { CadProdutoPage } from '../cad-produto/cad-produto';
import { ConfigPage } from '../config/config';
import { Produto } from '../../models/produto';
import { SharingService } from '../../providers/sharing-service';
import { AppSettings }  from '../../app/app-settings';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home {

   public searchTerm: string = "";
   public produtos: Array<Produto>;
   public loading: any;

   constructor(public navCtrl: NavController,
               public sharingService: SharingService,
               public loadingCtrl: LoadingController) {
   }

   ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.carregandoPage();
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

        this.findProdutos();
   }

   findProdutos(){
       //codigo	preco	dtpublicacao	cdloja	cdmarca	cdtipo	cdmedida	marca	loja	tipo	medida icon
       this.sharingService.findProdutos("")
       .then(dados => {
           this.produtos = new Array();
            for(let data of dados){

                var produto = AppSettings.convertToProduto(data);
                /*
                produto.codigo = data.codigo;
                produto.preco = data.preco;
                produto.dtpublicacao = data.dtpublicacao;
                produto.loja.cdloja = data.cdloja;
                produto.loja.nome = data.loja;
                produto.marca.cdmarca = data.cdmarca;
                produto.marca.descricao = data.marca;
                produto.tipo.cdtipo = data.cdtipo;
                produto.tipo.descricao = data.tipo;
                produto.medida.cdmedida = data.cdmedida;
                produto.medida.descricao = data.medida;
                produto.icon = data.icon;
                */
                this.produtos.push(produto);
            }
            console.log(this.produtos);
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

   filterItems(){

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
}
