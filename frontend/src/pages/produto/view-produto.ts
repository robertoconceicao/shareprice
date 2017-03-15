import { Component, ViewChild, ElementRef } from '@angular/core';
import { Produto }          from '../../models/produto';
import { NavParams, NavController, ToastController, LoadingController } from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';
import { SocialSharing } from 'ionic-native';
import { MapaPage } from '../mapa/mapa';


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
    public codigo: any;
    public loading: any;
    public flValidou: boolean;
    public qtdeok: any = 0;
    public qtdenok: any = 0;

    constructor(public navParams: NavParams,
                public sharingService: SharingService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public navCtrl: NavController){
        this.produto = new Produto();            
        this.codigo = this.navParams.get('codigo');        
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ViewProdutoPage');
        this.loading = this.loadingCtrl.create({
            content: 'Carregando informações...'
        });
        this.loading.present();
        this.flValidou = false;
        this.getQtdeValidarPreco();
        this.editarProduto();
    }

    editarProduto(){
        this.sharingService.findProdutoById(this.codigo)
            .then(produto => {
                this.produto = AppSettings.convertToProduto(produto[0]); 

                let profile = JSON.parse(localStorage.getItem("profile"));       
                this.sharingService.getUserJaValidouPreco(this.produto.codigo, profile.userId)
                    .then(dados => {
                        this.flValidou = dados.length > 0;
                        this.loading.dismiss();
                    }).catch(error => {
                        this.loading.dismiss();            
                        this.presentToast("Erro ao conectart com o servidor, verifique sua conexão com a internet.");
                    });
            })
            .catch(error => {
                this.loading.dismiss();            
                this.presentToast("Erro ao conectart com o servidor, verifique sua conexão com a internet.");
            });
    }

    validarPreco(opcao){
        this.loading = this.loadingCtrl.create({
            content: 'Enviando informação...'
        });
        this.loading.present(); 

        let profile = JSON.parse(localStorage.getItem("profile"));       
        this.sharingService.validarPreco(this.produto.codigo, profile.userId, opcao)
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
        this.sharingService.getQtdeValidarPreco(this.codigo)
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
        this.navCtrl.push(MapaPage, {codigo: this.codigo});
    }

    shareWhatsapp() {
        let message = this.formataShareMessage();            
        let image = this.produto.icon;
        let url = "http://www.google.com";

        SocialSharing.shareViaWhatsApp(message, image, url)
            .then(resp => {
                console.log("Funcionou o compartilhamento... "+ resp);
            })
            .catch(error => {
                console.log("Error ao tentar compartilhar informação");
            })
    }

    shareFacebook() {
        let message = this.formataShareMessage();            
        let image = this.produto.icon;
        let url = "http://www.google.com";

        SocialSharing.shareViaFacebook(message, image, url)
            .then(resp => {
                console.log("Funcionou o compartilhamento... "+ resp);
            })
            .catch(error => {
                console.log("Error ao tentar compartilhar informação");
            })
    }

    shareViaTwitter() {
        let message = this.formataShareMessage();            
        let image = this.produto.icon;
        let url = "http://www.google.com";

        SocialSharing.shareViaTwitter(message, image, url)
            .then(resp => {
                console.log("Funcionou o compartilhamento... "+ resp);
            })
            .catch(error => {
                console.log("Error ao tentar compartilhar informação");
            })
    }

    formataShareMessage(){
        return this.produto.marca.descricao 
        + ' ' + this.produto.medida.descricaoML 
        + ' R$ ' + this.produto.preco
        + ' ' + this.produto.loja.nome;
    }
}