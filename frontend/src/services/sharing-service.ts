import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
//import { Observable } from 'rxjs/Rx';
import { Produto }      from '../models/produto';
import { Filtro }      from '../models/filtro';
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

    if(!!produto.codigo){
      //UPDATE
      return this.http
                  .put(AppSettings.API_ENDPOINT + AppSettings.POST_PRODUTO + "/" +produto.codigo, 
                        JSON.stringify(jsonProduto), 
                        {headers: contentHeaders}
                  ).toPromise();
    } else {
      //INSERT
      return this.http
                  .post(AppSettings.API_ENDPOINT + AppSettings.POST_PRODUTO, 
                        JSON.stringify(jsonProduto), 
                        {headers: contentHeaders}
                  ).toPromise();
    }
  }

  /* 
  result do sql
  codigo	preco	dtpublicacao	cdloja	cdmarca	cdtipo	cdmedida	marca	loja	tipo	medida
   */
  findProdutos(filtro: Filtro) {
    let params = this.getParametrosUrl(filtro);
    return this.getHttpParamns(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTOS, params);    
  }

  filterItems(filtro: Filtro) {
    let params = this.getParametrosUrl(filtro);
    return this.getHttpParamns(AppSettings.API_ENDPOINT + AppSettings.GET_FILTER, params);    
  }

  afterProdutos(filtro: Filtro) {
    let params = this.getParametrosUrl(filtro);
    return this.getHttpParamns(AppSettings.API_ENDPOINT + AppSettings.AFTER_PRODUTOS, params);    
  }

  beforeProdutos(filtro: Filtro) {
    let params = this.getParametrosUrl(filtro);
    return this.getHttpParamns(AppSettings.API_ENDPOINT + AppSettings.BEFORE_PRODUTOS, params);    
  }
  
  getParametrosUrl(filtro: Filtro){
    let params: URLSearchParams = new URLSearchParams();
    if(!!filtro.posicao){
      params.set('posicao', filtro.posicao +"");
    }
    if(!!filtro.marca){
      params.set('marca', filtro.marca +"");
    }
    if(!!filtro.medida){
      params.set('medida', filtro.medida +"");
    }
    if(!!filtro.tipo){
      params.set('tipo',filtro.tipo +"");
    }
    if(!!filtro.maxvalor){
      params.set('maxvalor', filtro.maxvalor +"");
    }
    if(!!filtro.distancia){
      params.set('distancia', filtro.distancia +"");
    }
    if(!!filtro.searchTerm){
      params.set('searchTerm', filtro.searchTerm +"");
    }    
    return params;
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