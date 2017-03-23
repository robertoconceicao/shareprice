import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }                  from './app.component';
import { Home }                   from '../pages/home/home';
import { ProfilePage }            from '../pages/profile/profile';
import { CadProdutoPage }         from '../pages/cad-produto/cad-produto';
import { FiltrosPage }            from '../pages/filtros/filtros';
import { ConfigPage }             from '../pages/config/config';
import { LojaPage }               from '../pages/loja/loja-page';
import { SharingService }         from '../services/sharing-service';
import { MoedaRealPipe }          from '../pipes/moeda-real';
import { LoginPage }              from '../pages/login/login';
import { MapaPage }               from '../pages/mapa/mapa';

import { AuthConfig, AuthHttp }   from 'angular2-jwt';
import { AuthService }            from '../services/auth/auth.service';
import { Http }                   from '@angular/http';
import { Storage}  from '@ionic/storage';

import { ProdutoItem, PrecoComponent } from '../componentes';

import { ViewProdutoPage }        from '../pages/produto/view-produto';

let storage: Storage = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' });

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZmJkYjAyOC05NGYxLTQ2MzgtYTc4NC1iNmU2ZWFhYjE1YzAifQ.zj5MMaKCY2CZ81O6sqjmiiMeA0dCGuFdUsCG7X2F3SE'
  },
  'auth': {
    'facebook': {
      'scope': ['public_profile']
    },
    'google': {
      'webClientId': '874200786883-kk2gco0249nsaevabvv5htvpb3ftad3r.apps.googleusercontent.com'
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    Home,
    ProfilePage,
    LoginPage,
    CadProdutoPage,
    FiltrosPage,
    ConfigPage,
    LojaPage,
    MoedaRealPipe,
    ProdutoItem,
    PrecoComponent,
    ViewProdutoPage,
    MapaPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    ProfilePage,
    LoginPage,
    CadProdutoPage,
    FiltrosPage,
    ConfigPage,
    LojaPage,
    ProdutoItem,
    PrecoComponent,
    ViewProdutoPage,
    MapaPage
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      SharingService,
      AuthService,      
      {provide: AuthHttp, useFactory: getAuthHttp, deps: [Http]}
    ]
})

export class AppModule {}