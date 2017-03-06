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

import { AuthConfig, AuthHttp }   from 'angular2-jwt';
import { AuthService }            from '../services/auth/auth.service';
import { Http }                   from '@angular/http';
import { Storage }                from '@ionic/storage';

import { ProdutoItem, PrecoComponent } from '../componentes';

import { ViewProdutoPage }        from '../pages/produto/view-produto';

let storage: Storage = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' });

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}



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
    ViewProdutoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
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
    ViewProdutoPage
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      SharingService,
      AuthService,      
      {provide: AuthHttp, useFactory: getAuthHttp, deps: [Http]}
    ]
})

export class AppModule {}