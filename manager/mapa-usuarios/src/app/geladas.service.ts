import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export const contentHeaders = new Headers();
contentHeaders.append('Content-Type','application/json');

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

interface Codigodescricao {
    codigo: number;
    descricao: string;
}

const MANAGER_ENDPOINT = 'http://node-express-geladas.misais4yjc.us-west-2.elasticbeanstalk.com/manager/';
const API_ENDPOINT = 'http://node-express-geladas.misais4yjc.us-west-2.elasticbeanstalk.com/api/';
const GET_USER_NO_RAIO = "usernoraio";
const GET_QTDE_USER_NO_RAIO = "qtdeusernoraio";
const GET_LOJAS = "lojas";
const GET_MARCAS = 'marcas';
const GET_TIPOS = 'tipos';
const GET_MEDIDAS = 'medidas';

@Injectable()
export class GeladasService {

  private _marcas: BehaviorSubject<Codigodescricao[]>;
  private _tipos: BehaviorSubject<Codigodescricao[]>;
  private _medidas: BehaviorSubject<Codigodescricao[]>;

  constructor(public http: Http) { 
    this._marcas = <BehaviorSubject<Codigodescricao[]>>new BehaviorSubject([]);
    this._tipos = <BehaviorSubject<Codigodescricao[]>>new BehaviorSubject([]);
    this._medidas = <BehaviorSubject<Codigodescricao[]>>new BehaviorSubject([]);
    
    this.getHttp(API_ENDPOINT + GET_MARCAS)
      .then(marcas => {
          this._marcas.next(marcas);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Marcas");
      });

    this.getHttp(API_ENDPOINT + GET_TIPOS)
      .then(tipos => {
          this._tipos.next(tipos);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Tipos");
      });

    this.getHttp(API_ENDPOINT + GET_MEDIDAS)
      .then(medidas => {
          this._medidas.next(medidas);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Medidas");
      });
  }

  /*
  Resposta
  [{"lat":-27.5773331,"lng":-48.5079005},{"lat":-27.6058189,"lng":-48.5795943},{"lat":-27.5843525,"lng":-48.52392},{"lat":-27.6020077,"lng":-48.5934434},{"lat":-27.5902256,"lng":-48.600604}]
  */
  getUserNoRaio(lat: any, lng: any, raio: any){
    let params: string = "/"+lat+"/"+lng+"/"+raio;
    return this.getHttp(MANAGER_ENDPOINT + GET_USER_NO_RAIO + params);
  }
  
  getQtdeUserNoRaio(lat: any, lng: any, raio: any){
    let params: string = "/"+lat+"/"+lng+"/"+raio;
    return this.getHttp(MANAGER_ENDPOINT + GET_QTDE_USER_NO_RAIO + params);
  }
  getLojas(lat: any, lng: any, raio: any) {
    let params: string = "/"+lat+"/"+lng+"/"+raio;
    return this.getHttp(MANAGER_ENDPOINT + GET_LOJAS + params);            
  }

  get marcas() {
     return this._marcas.asObservable();
  }

  get tipos() {
    return this._tipos.asObservable();
  }

  get medidas() {
    return this._medidas.asObservable();
  }

  private getHttpParamns(url: string, params: URLSearchParams){
    return this.http.get(url, {search: params})
          .toPromise()
          .then(res => res.json())
          .catch((error) => {
            this.handleError(error);
          });
  }

  private getHttp(url: string){
    return this.http.get(url)
          .toPromise()
          .then(res => res.json())
          .catch((error) => {
            this.handleError(error);
          });
  }

  handleError(error: string){
    console.log("Erro na requisicao: "+error);
  }  
}
