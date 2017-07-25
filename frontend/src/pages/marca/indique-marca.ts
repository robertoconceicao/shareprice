import { Component, OnInit }  from '@angular/core';
import { NavController, ToastController }  from 'ionic-angular';
import { SharingService } from '../../services/sharing-service';
import { Home } from '../../pages';

@Component({
   selector: 'indique-marca',
   template: `
        <ion-header>
            <ion-navbar color="geladas">
                <ion-title>Indique uma marca</ion-title>
            </ion-navbar>
        </ion-header>

        <ion-content>
            <p align="center" padding="1px">
                Envia-nos indicações de marcas que você não encontrou no Geladas.
            </p>
            <form #indiqueMarcaForm="ngForm" (ngSubmit)="enviar()">
                <ion-list>
                    <ion-item>
                        <ion-label>Marca</ion-label>
                        <ion-input [(ngModel)]="marca" type="text" name="marca" placeholder="Informe o nome da marca"></ion-input>
                    </ion-item>
                
                </ion-list>
                <p>
                    <button type="submit" ion-button block icon-left [disabled]="!indiqueMarcaForm.form.valid || isDisable">
                        <ion-icon name="cloud-upload"></ion-icon>
                        Enviar
                    </button>
                </p>
            </form>
        </ion-content>
   `
})
export class IndiqueMarcaPage implements OnInit {

    public marca: string = ""; 
    public isDisable: boolean = false;

    constructor( public navCtrl: NavController,
                 public toastCtrl: ToastController,
                 public sharingService: SharingService){
    }

    ngOnInit(): void {
        
    }

    enviar():void {
      this.isDisable = true;
      this.sharingService.indiqueMarca(this.marca)
        .then(success => {
              let msg = "Obrigado pela sua contribuição";
              this.presentToast(msg);
              this.goBack();
              this.isDisable = false;
          })
          .catch(error => {
              this.presentToast("Erro ao enviar sugestão, favor tentar mais tarde.");
              this.isDisable = false;
          });
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
}