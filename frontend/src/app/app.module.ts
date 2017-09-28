import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }                  from './app.component';
import { Home, CadProdutoPage, FiltrosPage, ConfigPage, 
        LojaPage, LoginPage, MapaPage, TutorialPage, ViewProdutoPage, 
        MarcaPage, IndiqueMarcaPage, LocalusuarioPage,
        SelecionalocalizacaoPage } from '../pages';

import { IonicImageLoader } from 'ionic-image-loader';

import { SharingService }         from '../services/sharing-service';
import { MoedaRealPipe }          from '../pipes/moeda-real';

import { ProdutoItem, PrecoComponent, AutocompleteComponent, SearchlistComponent } from '../componentes';
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
    TutorialPage,
    AutocompleteComponent,
    MarcaPage,
    SearchlistComponent,
    IndiqueMarcaPage,
    LocalusuarioPage,
    SelecionalocalizacaoPage
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
        backButtonText: '',
        statusbarPadding: true
    }),
     IonicImageLoader.forRoot()
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
    TutorialPage,
    AutocompleteComponent,
    MarcaPage,
    SearchlistComponent,
    IndiqueMarcaPage,
    LocalusuarioPage,
    SelecionalocalizacaoPage
  ],
  providers: [
      {provide: ErrorHandler, useClass: IonicErrorHandler},
      SharingService,
      AdMob
    ]
})

export class AppModule {}