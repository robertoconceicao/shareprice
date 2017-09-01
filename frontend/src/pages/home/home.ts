import { Component, OnInit, ViewChild}  from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, LoadingController, Searchbar, AlertController, ModalController }  from 'ionic-angular';
import { LoginPage, ConfigPage, CadProdutoPage, FiltrosPage, LocalusuarioPage } from '../../pages';
import { Produto, Filtro, Municipio} from '../../models';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';
import { AdMob }  from '@ionic-native/admob';
import { Geolocation } from 'ionic-native';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
   selector: 'page-home',
   templateUrl: 'home.html'
})
export class Home implements OnInit {

   @ViewChild('searchbar') searchbar: Searchbar;
   public logo: string = "assets/images/logo-BEA.png";
   public searchTerm: string = "";
   public produtos: Array<Produto>;
   public noFilter: Array<Produto> = [];
   public loading: any;
   public searchTermControl;
   public lat: any;
   public lng: any;
   public filtro: Filtro;
   public search: boolean;
   public flLogado: boolean;
   public municipio: Municipio;
   public flJaMostrouPropaganda: boolean = false;

   constructor(public navCtrl: NavController,
               public sharingService: SharingService,
               public loadingCtrl: LoadingController,
               public alertCtrl: AlertController,
               public modalCtrl: ModalController,
               public admob: AdMob) {
     this.searchTermControl = new FormControl();
     this.searchTermControl.valueChanges
         .debounceTime(500)
         .distinctUntilChanged()
         .subscribe(search => {
            this.searchTerm = search;
            this.filterItems();
        });

     this.search = false;   
     this.verifyLogado();
   }

   ngOnInit(){
       console.log("OnInit HomePage");
       this.sharingService.filtro.subscribe(filtrosDados => {
           this.filtro = filtrosDados;
       });

       this.sharingService.lat.subscribe(lat=>{
          this.lat = lat;
       });

       this.sharingService.lng.subscribe(lng=>{
          this.lng = lng;
       });

       this.sharingService.municipio.subscribe( m => this.municipio = m);

       if(this.flLogado){
            this.sharingService.updateUsuario();
       }
        
       this.carregandoPage();
       this.buscarLojasDeOndeOusuarioEsta();
       this.showInterstitial();
   }

   buscarLojasDeOndeOusuarioEsta(){
        Geolocation.getCurrentPosition({timeout: 5000})
                    .then((resp) => {
                        this.sharingService.findLojasByLocationGPS(resp.coords.latitude, resp.coords.longitude);
                    }).catch((error) => {
                        
                    });

   }

   ionViewWillEnter() {
      console.log("ionViewWillEnter HomePage"); 
   }

   showInterstitial(){
        console.log("showInterstitial");
        if(!this.flJaMostrouPropaganda) {
            this.flJaMostrouPropaganda = true;
            this.admob.prepareInterstitial({
                adId: AppSettings.ADMOB_INTERSTITIAL,
                autoShow: true
            });
        }
   }

   clickSearch(){
       this.search = true;
   }

   isSearch(){
       return this.search;
   }

   onCancel(event){
      this.searchTerm = "";
      this.search = false;
      this.filterItems();
   }

   changeLocal(){
        let localModal = this.modalCtrl.create(LocalusuarioPage);
        localModal.onDidDismiss(municipio => {
            if(!!municipio) {
                this.sharingService.setMunicipio(municipio);
                this.sharingService.atualizaLocalusuario(municipio.cdIbge);
                if(this.flLogado){
                    this.sharingService.updateUsuario();
                }
                this.carregandoPage();
            }
        });
        localModal.present();
   }

   carregandoPage(){
       this.loading = this.loadingCtrl.create({
            spinner: 'crescent',
            showBackdrop: false
        });

        this.loading.present();
        this.filtro.lat = this.lat;
        this.filtro.lng = this.lng;

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
      if(this.flLogado){
         this.navCtrl.push(ConfigPage);
       } else {
           this.showAlertLogin();
       }
   }

   newProduto(){
       if(this.flLogado){
         this.navCtrl.push(CadProdutoPage);
       } else {
           this.showAlertLogin();
       }
   }

   isEmpty(){
       if(!!this.produtos){
          return this.produtos.length == 0;
       }
       return true;
   }

   hasFilter(){
       return (!!this.filtro.marca || !!this.filtro.medida || !!this.filtro.tipo || !!this.filtro.maxvalor || this.filtro.distancia != 30);
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

   verifyLogado(){
       this.sharingService.cdusuario.subscribe(cdusuario=>{
           console.log("verifyLogado .... ", cdusuario);
           this.flLogado = !!cdusuario;
       });
   }

   showAlertLogin(){
       let env = this;
       let confirmAlert = this.alertCtrl.create({
                              title: "Usuário não identificado",
                              message: "Faça o login, para acesso a todas funcionalidades.",
                              buttons: [{
                                text: 'Ignorar',
                                role: 'cancel'
                              }, {
                                text: 'Login',
                                handler: () => {
                                  env.navCtrl.push(LoginPage);
                                }
                              }]
                            });
                            confirmAlert.present();
   }
}