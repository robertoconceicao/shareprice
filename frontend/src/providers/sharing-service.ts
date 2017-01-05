import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Produto }      from '../models/produto';
import { AppSettings }  from '../app/app-settings';


export const contentHeaders = new Headers();
contentHeaders.append('Content-Type','application/json');

@Injectable()
export class SharingService {
  
  public produtos: Array<Produto>;
  
  constructor(public http: Http) {
    console.log('Hello SharingService Provider');
    this.produtos = new Array<Produto>();
  }
  
  postar(produto: Produto) :Promise<any> {
    console.log("Dados enviados: "+JSON.stringify(produto));    
    return this.http
                .post(AppSettings.API_ENDPOINT + AppSettings.POST_PRODUTO, 
                      JSON.stringify(produto), 
                      {headers: contentHeaders}
                ).toPromise();
  }

  findProdutos(paramsUrl: string): Observable<Produto[]> {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTOS)
        .map(res => <Produto[]> res.json());
  }

  getCategorias() {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_CATEGORIAS)
        .toPromise()
        .then(res => res.json())
		 	  .catch((error) => {
           this.handleError(error);
        });
  }

  getUnidademedidas() {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_UNIDADEMEDIDAS)
        .toPromise()
        .then(res => res.json())
		 	  .catch((error) => {
           this.handleError(error);
        });
  }

  findLojasByLocation(lat: any, lng: any) {
    let params: string = "/"+lat+"/"+lng;

    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_LOJAS + params )
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