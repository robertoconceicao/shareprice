import { Component } from '@angular/core';
import { Produto }          from '../../models/produto';
import { NavParams, ToastController, LoadingController } from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';

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

    constructor(public navParams: NavParams,
                public sharingService: SharingService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController){
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
                        this.presentToast("Erro ao conectart com o servidor, verifique sua conexão com a internet.");
                        this.loading.dismiss();            
                    });
            })
            .catch(error => {
                this.presentToast("Erro ao conectart com o servidor, verifique sua conexão com a internet.");
                this.loading.dismiss();            
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
                this.presentToast('Obrigado por validar');
                this.flValidou = true;
                this.loading.dismiss();
            }).catch(error => {
                this.presentToast("Erro ao conectart com o servidor, verifique sua conexão com a internet.");
                this.loading.dismiss();            
            });
    }

    presentToast(msg: string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }
}