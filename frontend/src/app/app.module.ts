import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }                  from './app.component';
import { Home, CadProdutoPage, FiltrosPage, ConfigPage, 
        LojaPage, LoginPage, MapaPage, TutorialPage, ViewProdutoPage } from '../pages';

import { SharingService }         from '../services/sharing-service';
import { MoedaRealPipe }          from '../pipes/moeda-real';

import { AuthConfig, AuthHttp }   from 'angular2-jwt';
import { Http }                   from '@angular/http';
import { ProdutoItem, PrecoComponent } from '../componentes';
import { AdMob }  from '@ionic-native/admob';

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
    MapaPage,
    TutorialPage
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
    MapaPage,
    TutorialPage
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      SharingService,
      AdMob
    ]
})

export class AppModule {}