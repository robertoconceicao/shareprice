import { Component } from '@angular/core';
import { Produto }          from '../../models/produto';
import { NavParams, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { AppSettings }  from '../../app/app-settings';
import { Geolocation, SocialSharing } from 'ionic-native';
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
    public urlMapa: string;

    constructor(public navParams: NavParams,
                public sharingService: SharingService,
                public loadingCtrl: LoadingController,
                public toastCtrl: ToastController,
                public navCtrl: NavController,
                public alertCtrl: AlertController){
        this.produto = new Produto();            
        this.codigo = this.navParams.get('codigo');        
        this.urlMapa = "https://www.google.com.br/maps/dir/";
       
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

                Geolocation.getCurrentPosition({timeout: 5000})
                .then((resp) => {
                    let origem =  resp.coords.latitude + ","+ resp.coords.longitude;
                    let destino = this.produto.loja.lat + ","+this.produto.loja.lng;
                    
                    this.urlMapa = this.urlMapa + origem + "/" +destino;
                }).catch((error) => {
                    console.log('Error getting location', error);
                    this.loading.dismiss();
                    let alert = this.alertCtrl.create({
                            title: "O serviço de localização esta desligado",
                            subTitle: "Por favor ligue sua localização e tente novamente.",
                            buttons: [{
                                text: 'Ok',
                                handler: () => {
                                
                                }
                            }]
                        });
                    alert.present();
                });

                this.sharingService.getUserJaValidouPreco(this.produto.codigo)
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

    shareProduto() {
        // this code is to use the social sharing plugin
        // message, subject, file, url
        let message = this.formataShareMessage();                    
        SocialSharing.share(message, message, this.pathImagem(), null)
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
        + ' R$ ' + this.produto.preco
        + ' ' + this.produto.loja.nome;
    }

    pathImagem(){
       return "assets/images/"+this.produto.tipo.cdtipo+""+this.produto.marca.cdmarca+""+this.produto.medida.cdmedida+".png";
    }
}