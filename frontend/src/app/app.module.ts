import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }                  from './app.component';
import { Home }                   from '../pages/home/home';
import { CadProdutoPage }         from '../pages/cad-produto/cad-produto';
import { FiltrosPage }            from '../pages/filtros/filtros';
import { ConfigPage }             from '../pages/config/config';
import { LojaPage }               from '../pages/loja/loja-page';
import { SharingService }         from '../services/sharing-service';
import { MoedaRealPipe }          from '../pipes/moeda-real';
import { LoginPage }              from '../pages/login/login';
import { MapaPage }               from '../pages/mapa/mapa';

import { AuthConfig, AuthHttp }   from 'angular2-jwt';
//import { AuthService }            from '../services/auth/auth.service';
import { Http }                   from '@angular/http';
import { ProdutoItem, PrecoComponent } from '../componentes';
import { ViewProdutoPage }        from '../pages/produto/view-produto';

@NgModule({
  declarations: [
    MyApp,
    Home,
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
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
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
      SharingService
    ]
})

export class AppModule {}