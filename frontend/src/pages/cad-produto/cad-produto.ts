import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ModalController, AlertController  } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Medida, Produto, Loja } from '../../models';

import { LojaPage } from '../loja/loja-page';
import { Home } from '../home/home';
import { SharingService } from '../../services/sharing-service';
import { NumberUtil } from '../../util/number-util';

import 'rxjs/add/operator/toPromise';

var self;

@Component({
  selector: 'page-cad-produto',
  templateUrl: 'cad-produto.html'
})
export class CadProdutoPage implements OnInit {
  public produto: Produto;
  public lat: any;
  public lng: any;  
  public loading: any;  
  public lojas: Array<Loja> = [];  
  public medidas: Array<Medida> = [];
  public medidasFiltradas: Array<Medida> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public sharingService: SharingService,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
    self = this;
  }

  ngOnInit(): void {
    console.log("ngOnInit ...");
    this.produto = new Produto();

    this.sharingService.marcas.subscribe(marcas => {
      this.produto.marca.cdmarca = marcas[0].cdmarca;
    });
    this.sharingService.tipos.subscribe(tipos => {
      this.produto.tipo.cdtipo = tipos[0].cdtipo;
    });
    this.sharingService.medidas.subscribe(medidas => {
      this.medidas = medidas;
      this.produto.medida.cdmedida = medidas[0].cdmedida;
    });

    this.medidasFiltradas = new Array<Medida>();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ...");
    
    this.loading = this.loadingCtrl.create({
      content: 'Carregando informações...'
    });

    this.loading.present();
    
    this.filtraMedidas();

    this.buscarIconeCerveja();
    // get localizacao do usuario
    this.getLojasByLocation();   
  }

  filtraMedidas() {
    var medidaspormarcas = this.sharingService.medidaspormarcas;
    var _medidas = new Array<number>();
    for(let i=0; i < medidaspormarcas.length; i++){
      if(!!self.produto && medidaspormarcas[i].cdmarca == self.produto.marca.cdmarca){
        console.log("callbackFiltroMarca: "+medidaspormarcas[i].cdmarca);
        _medidas = medidaspormarcas[i].medidas; //retorna um array de cdmedidas configurados por marca
        break;
      }
    }

    this.medidasFiltradas = new Array<Medida>();
    for(let i=0; i < _medidas.length; i++){ //percorre a lista de medidas por marca onde só tem cdmedida
      for(let j=0; j < self.medidas.length; j++){ //percorre a lista de todas medidas com todas as informações
        if(_medidas[i] == self.medidas[j].cdmedida){
          this.medidasFiltradas.push(self.medidas[j]); //retorna o objeto medida com todas as informações
        }
      }
    }
    self.produto.medida.cdmedida = this.medidasFiltradas[0].cdmedida;
    console.log("medidasAsermostradas: "+JSON.stringify(this.medidasFiltradas));    
  }

  postar(): void {
 //   if(this.validaCamposObrigatorios()){
      this.produto.preco = this.produto.preco.replace(/,/, '.'); //replace , por .
      this.sharingService.postar(this.produto)
        .then(success => {
              let msg = "Obrigado por cadastrar o produto";            
              this.presentToast(msg);
              this.goBack();
          })
          .catch(error => {
              this.presentToast("Erro ao conectart com o servidor, favor tentar mais tarde.");
          });
 //   }
  }

  validaCamposObrigatorios(){
      if(this.produto.marca.cdmarca > 0){
        this.showAlertCamposObrigatorio("seleciona uma marca");
        return false;
      }

      if(this.produto.tipo.cdtipo > 0){
        this.showAlertCamposObrigatorio("seleciona um tipo");
        return false;
      }

      if(this.produto.medida.cdmedida > 0){
        this.showAlertCamposObrigatorio("seleciona uma medida");
        return false;
      }

      if(this.produto.preco != '0' && this.produto.preco.length > 0){
        this.showAlertCamposObrigatorio("informe o preço");
        return false;
      }
      return true;
  }

  showAlertCamposObrigatorio(campo: string){   
    let alert = this.alertCtrl.create({
      title: 'Campo obrigatório',
      subTitle: campo,
      buttons: ['OK']
    });
    alert.present();

  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  goBack(){
    this.navCtrl.setRoot(Home);
  }

  getLojasByLocation(){
    //pega as lojas pela localizacao do usuario
    Geolocation.getCurrentPosition({timeout: 20000}).then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;

      this.sharingService.findLojasByLocation(this.lat, this.lng)
          .then(lojas => {
            this.lojas = lojas;

            if(!!lojas && lojas.length > 0){
              this.produto.loja = this.lojas[0];
            }
            this.loading.dismiss();
          })
          .catch((error) => {
              console.log('Error ao tentar buscar lojas', error);
              this.loading.dismiss();
              let alert = this.alertCtrl.create({
                      title: "O serviço de localização esta desligado",
                      subTitle: "Por favor ligue sua localização e tente novamente.",
                      buttons: [{
                        text: 'Ok',
                        handler: () => {
                          this.goBack();
                        }
                      }]
                  });
              alert.present();
          })
    }).catch((error) => {
      console.log('Error getting location', error);
      this.loading.dismiss();
      this.goBack();
    });
  }

  buscarIconeCerveja(){
    if(this.produto.marca.cdmarca != 0 && this.produto.tipo.cdtipo != 0 && this.produto.medida.cdmedida != 0){
       this.produto.icon = "assets/images/"+this.produto.tipo.cdtipo+""+this.produto.marca.cdmarca+""+this.produto.medida.cdmedida+".png";
    }
  }

  changeLoja(){
    let lojaModal = this.modalCtrl.create(LojaPage, {'lojas': this.lojas});
    lojaModal.onDidDismiss(data => {
      if(!!data){
        this.produto.loja = data;
      }
    });
    lojaModal.present();
  }

  onChangeMarca(event){
    this.produto.marca.cdmarca = event;
    this.filtraMedidas();
    this.buscarIconeCerveja();
  }

  onChangeTipo(event){
    this.produto.tipo.cdtipo = event;
    this.buscarIconeCerveja();
  }

  onChangeMedida(event){
    this.produto.medida.cdmedida = event;
    this.buscarIconeCerveja();
  }

  onChangePreco(event){
      this.produto.preco = NumberUtil.formataMoeda(event.target.value);
  }
}