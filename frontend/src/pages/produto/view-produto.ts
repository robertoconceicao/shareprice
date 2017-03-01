import { Component } from '@angular/core';
import { Produto }          from '../../models/produto';
import { NavParams, LoadingController } from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';

@Component({
    selector: 'view-produto',
    templateUrl: 'view-produto.html',
    styles: [`
        .precoClass {  
            font-size: 1.0em;  
            color: dodgerblue !important; 
            margin-top: 14px;
        }
    `]
})
export class ViewProdutoPage {

    public produto: Produto;
    public codigo: any;
    public loading: any;

    constructor(public navParams: NavParams,
                public sharingService: SharingService,
                public loadingCtrl: LoadingController){
        this.produto = new Produto();            
        this.codigo = this.navParams.get('codigo');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ViewProdutoPage');
        this.loading = this.loadingCtrl.create({
            content: 'Carregando informações...'
        });
        this.loading.present();

        this.editarProduto();
    }

    editarProduto(){
        this.sharingService.findProdutoById(this.codigo)
            .then(produto => {
                this.produto = AppSettings.convertToProduto(produto[0]);            
                this.loading.dismiss();
            })
            .catch(error => {
                console.log("Erro ao conectart com o servidor, favor tentar mais tarde.");
                this.loading.dismiss();            
            });
    }
}