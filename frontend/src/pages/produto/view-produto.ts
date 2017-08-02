import { Component } from '@angular/core';
import { Produto }          from '../../models/produto';
import { NavParams, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { SocialSharing } from 'ionic-native';
import { MapaPage } from '../mapa/mapa';
import { NumberUtil } from '../../util/number-util';

@Component({
    selector: 'view-produto',
    templateUrl: 'view-produto.html',
    styles: [`
        .precoClass {  
            font-size: 1.0em;  
            color: dodgerblue !important;
        }
    `]
})
export class ViewProdutoPage {

    public produto: Produto;    
    public loading: any;
    public flValidou: boolean;
    public qtdeok: any = 0;
    public qtdenok: any = 0;
    public urlMapa: string;
    public lat: any;
    public lng: any;

    constructor(public navParams: NavParams,
                public sharingService: SharingService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public navCtrl: NavController,
                public alertCtrl: AlertController){

        this.produto = new Produto();
        this.produto = this.navParams.get('produto');

        this.urlMapa = "https://www.google.com.br/maps/dir/";

        this.sharingService.lat.subscribe(lat=>{
            this.lat = lat;
        });

        this.sharingService.lng.subscribe(lng=>{
            this.lng = lng;
        });        
    }

    ionViewDidLoad() {
        this.flValidou = false;
        this.getQtdeValidarPreco();        
        this.editarProduto();
    }

    editarProduto(){                
        let origem =  this.lat + ","+ this.lng;
        let destino = this.produto.loja.lat + ","+this.produto.loja.lng;
        
        this.urlMapa = this.urlMapa + origem + "/" +destino;

        this.sharingService.getUserJaValidouPreco(this.produto.codigo)
            .then(dados => {
                this.flValidou = dados.length > 0;               
            }).catch(error => {
                this.presentToast("Erro ao conectart com o servidor, verifique sua conexão com a internet.");
            });
    }

    validarPreco(opcao){
        this.loading = this.loadingCtrl.create();
        this.loading.present();

        this.sharingService.validarPreco(this.produto.codigo, opcao)
            .then(dados => {
                this.loading.dismiss();
                this.getQtdeValidarPreco();
                this.flValidou = true;
                this.presentToast('Obrigado por validar');
            }).catch(error => {
                this.loading.dismiss();            
                this.presentToast("Erro ao conectart com o servidor, verifique sua conexão com a internet.");
            });
    }

    getQtdeValidarPreco(){
        this.sharingService.getQtdeValidarPreco(this.produto.codigo)
            .then(dados => {
                this.qtdeok = dados[0].qtdeok;
                this.qtdenok = dados[0].qtdenok;
            }).catch(error => {
                console.log("Error ao buscar a quantidade da validacao de preco");
            });
    }

    presentToast(msg: string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }

    abrirMapa(){
        this.navCtrl.push(MapaPage, {codigo: this.produto.codigo});
    }

    shareProduto() {
        let message = this.formataShareMessage();     
        SocialSharing.share(message, "*Promoção de Cerveja*", this.pathImagem(), 'https://geladasoficial.com/produto/'+this.produto.codigo)
            .then(resp => {
                console.log("Funcionou o compartilhamento... "+ resp);
            })
            .catch(() => {
                console.log("Error ao tentar compartilhar informação");
            });
    }

    formataShareMessage(){        
        return this.produto.marca.descricao 
        + ' ' + this.produto.medida.descricaoML 
        + ' R$ ' + NumberUtil.formataMoeda(this.produto.preco)
        + ' ' + this.produto.loja.nome;
    }

    pathImagem(){
       return "http://geladasoficial.com/images/"+this.produto.marca.cdmarca+"/"+this.produto.tipo.cdtipo+"/"+this.produto.medida.cdmedida+".png";
    }
}