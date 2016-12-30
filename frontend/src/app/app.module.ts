import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }  from './app.component';
import { Home }   from '../pages/home/home';
import { CadProdutoPage } from '../pages/cad-produto/cad-produto';
import { FiltrosPage } from '../pages/filtros/filtros';
import { ConfigPage } from '../pages/config/config';
import { SharingService } from '../providers/sharing-service';

@NgModule({
  declarations: [
    MyApp,
    Home,
    CadProdutoPage,
    FiltrosPage,
    ConfigPage
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
    ConfigPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},
    SharingService]
})
export class AppModule {}