import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';
import { Produto }      from '../models/produto';
import { AppSettings }  from '../app/app-settings';

@Injectable()
export class SharingService {
  
  public produtos: Array<Produto>;
  
  constructor(public http: Http) {
    console.log('Hello SharingService Provider');
    this.produtos = new Array<Produto>();
  }
  
  postar(produto: Produto) :Promise<any> {
    let headers = new Headers({'Content-Type':'application/json'});

    return this.http
          .post(AppSettings.API_ENDPOINT + AppSettings.POST_PRODUTO, 
                JSON.stringify(produto),
                {headers: headers})
          .toPromise();
  }

  findProdutos(paramsUrl: string): Observable<Produto[]> {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTOS)
        .map(res => <Produto[]> res.json());
  }
  /*
  findProdutos(paramsUrl: string) {
    return this.http.get(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTOS)
              .toPromise();
  }
  */
}