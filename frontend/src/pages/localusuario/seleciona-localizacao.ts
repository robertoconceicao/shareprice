import { Component, OnInit }  from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, ModalController } from 'ionic-angular';
import { Municipio, Usuario } from '../../models';
import { NavController }  from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { Geolocation, NativeStorage, Diagnostic } from 'ionic-native';
import { Home, LocalusuarioPage } from '../../pages';
import { AppSettings }  from '../../app/app-settings';

const SUCCESS             = 0;
const ERRO_NOT_AUTHORIZED = 1;
const MODO_DEBUGGER       = true;

@Component({
   selector: 'seleciona-localizacao',
   template: `
        <ion-header>
            <ion-navbar color="geladas">
                <ion-title>
                    Localização
                </ion-title>
            </ion-navbar>
        </ion-header>

        <ion-content>
            <ion-list>
               <ion-item *ngIf="!isBusy" (click)="changeLocal()">
                    <ion-icon name="compass" item-left large></ion-icon>

                    <h2 *ngIf="!!municipio.municipio">{{municipio.municipio +", "+ municipio.uf}}</h2>
                    <h2 *ngIf="!municipio.municipio">Selecione uma localização</h2>
               </ion-item>
               
               <ion-item *ngIf="isBusy" class="center">
                 <ion-spinner  name="crescent"> </ion-spinner>
               </ion-item>
            </ion-list>

        </ion-content>

        <ion-footer no-border>
            <ion-toolbar color="white">
                <button *ngIf="mostrarBotao" ion-button block (click)="onHome()">                
                    OK
                </button>
            </ion-toolbar>
        </ion-footer>
   `
})
export class SelecionalocalizacaoPage implements OnInit {
    public municipio: Municipio;
    public isBusy: boolean = true;
    public usuario: Usuario;
    public mostrarBotao: boolean = false;

    constructor( private _http: Http,
                 public navCtrl: NavController,
                 public navParams: NavParams,
                 public modalCtrl: ModalController,
                 public sharingService: SharingService){
        this.buscaInformacaoLocalizacao();
    }

    ngOnInit(): void {
        
    }

    onHome(){
        this.navCtrl.setRoot(Home);
    }

    changeLocal() {
        let localModal = this.modalCtrl.create(LocalusuarioPage);
        localModal.onDidDismiss(municipio => {
            this.setMunicipio(municipio);
            this.isBusy = false;
            this.mostrarBotao = true;
            this.sharingService.atualizaLocalusuario(this.municipio.cdIbge);
        });
        localModal.present();
    }
    
    buscaInformacaoLocalizacao() {
        if(MODO_DEBUGGER){
            console.log("Modo Debugger");
            //insere um novo usuario no sistema
            this.usuario = new Usuario();
            this.usuario.cdusuario = "G115862700861296845675";
            this.usuario.avatar = "https://lh5.googleusercontent.com/-NkphZfbAqNI/AAAAAAAAAAI/AAAAAAAAC2Y/2RbWqlwadFI/s96-c/photo.jpg";
            this.usuario.nome = "Roberto da conceicao";
            this.usuario.email = "conceicao.roberto@gmail.com";
            NativeStorage.setItem('user', this.usuario);
            this.sharingService.setCdusuario(this.usuario.cdusuario);
        }
        let env = this;
        this.verificaGPSAtivo()
            .then((resp) => {
            //pega os produtos pela localizacao do usuario
            Geolocation.getCurrentPosition({timeout: 5000})
            .then((resp) => {
                this.sharingService.setLat(resp.coords.latitude);
                this.sharingService.setLng(resp.coords.longitude); 
                
                NativeStorage.getItem(AppSettings.KEY_USUARIO)
                .then( function (usuario) {
                    env.sharingService.setCdusuario(usuario.cdusuario);
                    env.sharingService.insereUsuario(usuario);
                    this.usuario = usuario;
                }, function (error) {
                });
                this.buscaMunicipioByLatLng(resp.coords.latitude, resp.coords.longitude);
            }).catch((error) => {
                this.naoConsguiuPegarLocalizacao();
            });
        }).catch((error) => {
            this.naoConsguiuPegarLocalizacao();
        });
  }

  verificaGPSAtivo(): Promise<any> {
    return new Promise((resolve, reject) => {
        Diagnostic.requestLocationAuthorization("when_in_use")
        .then((value) => {
          resolve(SUCCESS);
          console.log(" Sucesso no request Autorizacao GPS");
        }).catch((error)=>{
            console.log(" ERRO no request Autorizacao GPS");
          reject(ERRO_NOT_AUTHORIZED);
        });
    });
  }

  buscaMunicipioByLatLng(lat: any, lng: any) {
      this.sharingService.buscaMunicipioByLatLng(lat, lng)
                        .then(municipio => {
                               if(!!municipio) {
                                    this.setMunicipio(municipio);
                                    this.isBusy = false;
                                    this.mostrarBotao = true;
                                    this.sharingService.atualizaLocalusuario(this.municipio.cdIbge);
                               } else {
                                    this.naoConsguiuPegarLocalizacao();   
                               }
                            })
                            .catch((error) => {
                                this.naoConsguiuPegarLocalizacao();
                            });
  }

  naoConsguiuPegarLocalizacao(){
    this.isBusy = false;
    this.municipio = new Municipio();
  }

  setMunicipio(m: Municipio){
      this.municipio = m;
      this.sharingService.setMunicipio(m);
  }
}