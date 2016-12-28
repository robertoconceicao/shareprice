import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp }  from './app.component';
import { Home }   from '../pages/home/home';
import { CadProdutoPage } from '../pages/cad-produto/cad-produto';
import { FiltrosPage } from '../pages/filtros/filtros';

@NgModule({
  declarations: [
    MyApp,
    Home,
    CadProdutoPage,
    FiltrosPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Home,
    CadProdutoPage,
    FiltrosPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}