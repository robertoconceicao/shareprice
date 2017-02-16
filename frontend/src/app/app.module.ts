import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }                  from './app.component';
import { Home }                   from '../pages/home/home';
import { CadProdutoPage }         from '../pages/cad-produto/cad-produto';
import { FiltrosPage }            from '../pages/filtros/filtros';
import { ConfigPage }             from '../pages/config/config';
import { LojaPage }               from '../pages/loja/loja-page';
import { SharingService }         from '../providers/sharing-service';
import { MoedaRealPipe }          from '../pipes/moeda-real';

@NgModule({
  declarations: [
    MyApp,
    Home,
    CadProdutoPage,
    FiltrosPage,
    ConfigPage,
    LojaPage,
    MoedaRealPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    CadProdutoPage,
    FiltrosPage,
    ConfigPage,
    LojaPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    SharingService]
})
export class AppModule {}