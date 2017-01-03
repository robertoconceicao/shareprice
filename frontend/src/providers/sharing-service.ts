import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Produto }      from '../models/produto';
import { Categoria }      from '../models/categoria';
import { Unidademedida }      from '../models/unidademedida';
import { Loja }      from '../models/loja';
import { AppSettings }  from '../app/app-settings';

@Injectable()
export class SharingService {
  
  public produtos: Array<Produto>;
  
  constructor(public http: Http) {
    console.log('Hello SharingService Provider');
    this.produtos = new Array<Produto>();
  }
  
  postar(produto: Produto) :Promise<any> {   
    console.log("Dados enviados: "+JSON.stringify(produto));
    let headers = new Headers({'Content-Type':'application/json'});
    return this.http
                .post(AppSettings.API_ENDPOINT + AppSettings.POST_PRODUTO, 
                      JSON.stringify(produto),{headers: headers}
                ).toPromise();
                //.then(res => res.json())
                //.catch(this.handleError);
  }

  findProdutos(paramsUrl: string): Observable<Produto[]> {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTOS)
        .map(res => <Produto[]> res.json());
  }

  getCategorias() {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_CATEGORIAS)
        .toPromise()
        .then(res => res.json())
		 	  .catch(this.handleError);
        //.map(res => <Categoria[]> res.json());
  }

  getUnidademedidas() {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_UNIDADEMEDIDAS)
        .toPromise()
        .then(res => res.json())
		 	  .catch(this.handleError);
        //.map(res => <Unidademedida[]> res.json());
  }

  findLojas(paramsUrl: string) {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_LOJAS)
        .toPromise()
        .then(res => res.json())
		 	  .catch(this.handleError);
        //.map(res => <Loja[]> res.json());
  }

  handleError(){
    console.log("Erro na requisicao");
  }
  /*
  findProdutos(paramsUrl: string) {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTOS)
              .toPromise();
  }
  */
}