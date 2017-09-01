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

interface Produto {
    codigo: number;
    cdloja: string;
    cdtipo: number;
    cdmarca: number;
    cdmedida: number;
    preco: string;    
    dtpublicacao: Date;
    icon: string;
    cdusuario: string;
}

const MANAGER_ENDPOINT = 'http://geladasoficial.com/manager/';//'http://localhost:3000/manager/';//'http://geladasoficial.com/manager/';
const API_ENDPOINT     = 'http://geladasoficial.com/api/';//'http://localhost:3000/api/';//'http://geladasoficial.com/api/';
const GET_USER_NO_RAIO = "usernoraio";
const GET_QTDE_USER_NO_RAIO = "qtdeusernoraio";
const GET_LOJAS = "lojas";
const GET_PRODUTOS = "produtos";
const GET_MARCAS = 'marcas';
const GET_TIPOS = 'tipos';
const GET_MEDIDAS = 'medidas';
const POST_PRODUTO = 'produto';
const GET_MUNICIPIOS = "municipios";

@Injectable()
export class GeladasService {

  private _marcas: BehaviorSubject<any>;
  private _tipos: BehaviorSubject<any>;
  private _medidas: BehaviorSubject<any>;
  private _municipios: BehaviorSubject<any[]>;

  constructor(public http: Http) { 
    this._marcas = <BehaviorSubject<any>>new BehaviorSubject([]);
    this._tipos = <BehaviorSubject<any>>new BehaviorSubject([]);
    this._medidas = <BehaviorSubject<any>>new BehaviorSubject([]);
    this._municipios = <BehaviorSubject<any>>new BehaviorSubject([]);
    
    this.getHttp(API_ENDPOINT + GET_MARCAS)
      .then(marcas => {
          this._marcas.next(marcas);
          console.log("marcas", marcas);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Marcas");
      });

    this.getHttp(API_ENDPOINT + GET_TIPOS)
      .then(tipos => {
          this._tipos.next(tipos);
          console.log("tipos", tipos);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Tipos");
      });

    this.getHttp(API_ENDPOINT + GET_MEDIDAS)
      .then(medidas => {
          var sorrtedArray:Array<any> = medidas.sort((n1,n2)=> {
            if(n1.ml > n2.ml){
              return 1;
            } 
            
            if(n1.ml < n2.ml){
              return -1;
            }
            return 0;
          });
          this._medidas.next(sorrtedArray);
          console.log("medidas", sorrtedArray);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Medidas");
      });

      this.getHttp(API_ENDPOINT + GET_MUNICIPIOS)      
        .then(lista => {
          this._municipios.next(lista);    
        })
        .catch(error => {
          console.log("Erro ao tentar carregar municipios");
        });
  }

  postar(produto: Produto) :Promise<any> {
    let jsonProduto = {
      cdusuario: produto.cdusuario,
      cdtipo: produto.cdtipo,
      cdmarca: produto.cdmarca,
      cdloja: produto.cdloja,
      cdmedida: produto.cdmedida,
      preco: produto.preco,
      dtpublicacao: new Date()
    };
    console.log("Dados enviados: "+JSON.stringify(jsonProduto));
    return this.http
                  .post(API_ENDPOINT + POST_PRODUTO, 
                        JSON.stringify(jsonProduto), 
                        {headers: contentHeaders}
                  ).toPromise();    
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

  getLojasByName(name: any, lat: any, lng: any, raio: any) {
    let params: string = "/"+name+"/"+lat+"/"+lng+"/"+raio;
    return this.getHttp(MANAGER_ENDPOINT + GET_LOJAS + params);            
  }

  getProdutos(lat: any, lng: any, raio: any) {
    let params: string = "/"+lat+"/"+lng+"/"+raio;
    return this.getHttp(MANAGER_ENDPOINT + GET_PRODUTOS + params);            
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

  get municipios() {
    return this._municipios.asObservable();
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
