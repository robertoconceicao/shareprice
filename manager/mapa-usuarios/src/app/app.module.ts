import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GeladasService } from './geladas.service';

import { AgmCoreModule } from 'angular2-google-maps/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,    
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDoEv_-7dw4vRJ0WUU_Uwreq6SvvshV0Qg'
    })
  ],
  providers: [GeladasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
