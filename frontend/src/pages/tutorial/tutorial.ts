import { Component } from '@angular/core';
import { NavController }  from 'ionic-angular';
import { Home } from '../../pages';

@Component({
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  constructor(public navCtrl: NavController){

  }

  slides = [
    {
      title: "Bem Vindo ao Geladas!",
      description: "O <b>Geladas</b> é um aplicativo colaborativo, onde as pessoas publicam as promoções de <b>cervejas</b> encontradas nos supermercados.",
      image: "assets/images/logo-BEA.png",
    },
    {
      title: "Promoções Via Localização",
      description: "As promoções serão mostradas conforme sua localização.",
      image: "assets/images/slide-2.png",
    },
    {
      title: "Notificações",
      description: "Escolha as marcas de cerveja de sua preferência. Quando alguém publicar uma dessas cervejas você será notificado.",
      image: "assets/images/slide-3.png",
    }
  ];

  onComecar(){
    this.navCtrl.setRoot(Home);
  }
}