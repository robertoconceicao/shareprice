import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
//import { Observable } from 'rxjs/Rx';
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
    let jsonProduto = {
      cdtipo: produto.tipo.cdtipo,
      cdmarca: produto.marca.cdmarca,
      cdloja: produto.loja.cdloja,
      cdmedida: produto.medida.cdmedida,
      preco: produto.preco,
      dtpublicacao: produto.dtpublicacao
    };
    console.log("Dados enviados: "+JSON.stringify(jsonProduto));

    return this.http
                .post(AppSettings.API_ENDPOINT + AppSettings.POST_PRODUTO, 
                      JSON.stringify(jsonProduto), 
                      {headers: contentHeaders}
                ).toPromise();
  }

  /* 
  result do sql
  codigo	preco	dtpublicacao	cdloja	cdmarca	cdtipo	cdmedida	marca	loja	tipo	medida
   */
  findProdutos(paramsUrl: string) {
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTOS);    
  }

  findProdutoById(codigo: any){
    let params: string = "/"+codigo;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTO + params);            
  }

  getMarcas() {
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MARCAS);
  }

  getTipos() {
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_TIPOS);
  }

  getMedidas() {
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MEDIDAS);
  }

  findLojasByLocation(lat: any, lng: any) {
    let params: string = "/"+lat+"/"+lng;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_LOJAS + params);            
  }

  findIconeCerveja(cdmarca: any, cdtipo: any, cdmedida: any) {
    let params: string = "/"+cdmarca+"/"+cdtipo+"/"+cdmedida;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_ICONE + params);            
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