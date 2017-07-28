import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { NativeStorage } from 'ionic-native';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Produto, Filtro, Usuario, Marca, Tipo, Medida, Confignotificacao, Medidapormarca, Municipio }  from '../models';
import { AppSettings }  from '../app/app-settings';


export const contentHeaders = new Headers();
contentHeaders.append('Content-Type','application/json');

@Injectable()
export class SharingService {
  
  public produtos: Array<Produto>;
  public medidaspormarcas: Array<Medidapormarca>;

  private _marcas: BehaviorSubject<Marca[]>;
  private _tipos: BehaviorSubject<Tipo[]>;
  private _medidas: BehaviorSubject<Medida[]>;
  private _filtro: BehaviorSubject<Filtro>;  
  private _device_token: BehaviorSubject<string>;
  private _lat: BehaviorSubject<number>;
  private _lng: BehaviorSubject<number>;
  private _cdusuario: BehaviorSubject<string>;
  private _municipios: BehaviorSubject<Municipio[]>;
  private _municipio: BehaviorSubject<Municipio>;

  constructor(public http: Http) {
    console.log('Hello SharingService Provider');
    this.produtos = new Array<Produto>();
    this._marcas = <BehaviorSubject<Marca[]>>new BehaviorSubject([]);
    this._tipos = <BehaviorSubject<Tipo[]>>new BehaviorSubject([]);
    this._medidas = <BehaviorSubject<Medida[]>>new BehaviorSubject([]);    
    this._filtro = <BehaviorSubject<Filtro>>new BehaviorSubject(new Filtro());    
    this._device_token = <BehaviorSubject<string>> new BehaviorSubject("");
    this._lat = <BehaviorSubject<number>> new BehaviorSubject(0);
    this._lng = <BehaviorSubject<number>> new BehaviorSubject(0);
    this._cdusuario = <BehaviorSubject<string>> new BehaviorSubject("");
    this._municipios = <BehaviorSubject<Municipio[]>>new BehaviorSubject([]);
    this._municipio = <BehaviorSubject<Municipio>> new BehaviorSubject(new Municipio());
    this.medidaspormarcas = new Array<Medidapormarca>();
    this.loadListas();
  }
  
  loadListas(){
    console.log("Carrega as listas ");    
    this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MARCAS)
      .then(marcas => {
          this._marcas.next(marcas);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Marcas");
      });

    this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_TIPOS)
      .then(tipos => {
          this._tipos.next(tipos);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Marcas");
      });

    this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MEDIDAS)
      .then(medidas => {
          this._medidas.next(medidas);
      })
      .catch(error => { 
          console.log("Erro ao buscar as Marcas");
      });
    
    this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MEDIDA_POR_MARCA)      
      .then(lista => {         
        this.medidaspormarcas = lista;        
      })
      .catch(error => {
        console.log("Erro ao tentar carregar medidas por marca");
      });

    if(this._municipios.value.length <= 0){
      this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MUNICIPIOS)      
        .then(lista => {
          this._municipios.next(lista); 
          NativeStorage.setItem(AppSettings.KEY_LISTA_MUNICIPIOS, lista);       
        })
        .catch(error => {
          console.log("Erro ao tentar carregar municipios");
        });
    }

    let filtro = new Filtro();
    filtro.distancia = 30;
    this.setFiltro(filtro);
  }

  postar(produto: Produto) :Promise<any> {
    let jsonProduto = {
      cdusuario: this._cdusuario.value,
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

  insereUsuario(usuario: Usuario){
    let jsonUsuario = {
      cdusuario: usuario.cdusuario,
      nome: usuario.nome,
      avatar: usuario.avatar,
      email: usuario.email,
      devicetoken: this._device_token.getValue(),
      lat: this._lat.getValue(),
      lng: this._lng.getValue()
    };

    this.setCdusuario(usuario.cdusuario);
    
    return  this.http
                .post(AppSettings.API_ENDPOINT + AppSettings.POST_USUARIO, 
                    JSON.stringify(jsonUsuario), 
                    {headers: contentHeaders}
                ).toPromise();
  }

  configuraNotificacao(config: Confignotificacao){
    let jsonConfig = {
      cdusuario: this._cdusuario.value,
      raio: config.raio,
      flnotificar: config.flnotificar,
      flemail: config.flemail,
      cdconfignotificacao: config.cdconfignotificacao,
      marcas: config.marcas
      //tipos: config.tipos,
      //medidas: config.medidas
    };

    console.log("post configurar notificacao: "+JSON.stringify(jsonConfig));
    return this.http
                .post(AppSettings.API_ENDPOINT + AppSettings.POST_CONFIG_NOTIFICACAO, 
                    JSON.stringify(jsonConfig), 
                    {headers: contentHeaders}
                ).toPromise();
  }

  getConfiguraNotificacao(cdusuario: string){
    let params: URLSearchParams = new URLSearchParams();
    params.set("cdusuario", cdusuario);
    return this.getHttpParamns(AppSettings.API_ENDPOINT + AppSettings.GET_CONFIG_NOTIFICACAO, params);
  }

  buscaMunicipioByLatLng(lat: any, lng: any) {
    let params: string = "/"+lat+"/"+lng;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MUNICIPIO + params);            
  }

  buscaMunicipioByUsuario(cdusuario: string) {
    let params: string = "/"+cdusuario;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_MUNICIPIO + params);            
  }

  validarPreco(cdproduto: any, opcao: any){    
    let jsonValidaPreco = {
      cdproduto: cdproduto,
      cdusuario: this._cdusuario.value,
      flcerto: opcao
    };
    return  this.http
                .post(AppSettings.API_ENDPOINT + AppSettings.POST_VALIDA_PRECO, 
                    JSON.stringify(jsonValidaPreco), 
                    {headers: contentHeaders}
                ).toPromise();
  }

  atualizaLocalusuario(cdIbge: any){
    if(!!this._cdusuario.value) {
      let jsonParam = {
        cdIbge: cdIbge,
        cdusuario: this._cdusuario.value
      };
      return  this.http
                  .post(AppSettings.API_ENDPOINT + AppSettings.POST_LOCAL_USUARIO, 
                      JSON.stringify(jsonParam), 
                      {headers: contentHeaders}
                  ).toPromise();
    }
    return null;
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
    if(!!filtro.marca.cdmarca){
      params.set('marca', filtro.marca.cdmarca +"");
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
    if(!!filtro.searchTerm){
      params.set('searchTerm', filtro.searchTerm +"");
    }

    params.set('distancia', filtro.distancia +"");    
    params.set('lat', this._lat.value +"");
    params.set('lng', this._lng.value +"");
    return params;
  }

  findProdutoById(codigo: any){
    let params: string = "/"+codigo;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_PRODUTO + params);            
  }

//TODO 
  findMunicipioByIbge(cdIbge: number){
    return this._municipios.value.filter(x => x.cdIbge === cdIbge)[0];
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

  get filtro() {
    return this._filtro.asObservable();
  }

  get devicetoken(){
    return this._device_token.asObservable();
  }

  get lat(){
    return this._lat.asObservable();
  }

  get lng(){
    return this._lng.asObservable();
  }

  get cdusuario(){
    return this._cdusuario.asObservable();
  }

  get municipios(){
    return this._municipios.asObservable();
  }

  get municipio(){
    return this._municipio.asObservable();
  }

  setMunicipios(lista: Municipio[]){
    this._municipios.next(lista);
  }

  setMunicipio(municipio: Municipio){
    this._municipio.next(municipio);
    this.setLat(municipio.lat);
    this.setLng(municipio.lng);
  }

  setCdusuario(cdusuario: string){
    this._cdusuario.next(cdusuario);
  }

  setLat(lat: number){
    this._lat.next(lat);
  }

  setLng(lng: number){
    this._lng.next(lng);
  }

  setDevicetoken(token: string){
    this._device_token.next(token);
  }

  setFiltro(filtro: Filtro){
    this._filtro.next(filtro);
  }

  findLojasByLocation(lat: any, lng: any) {
    let params: string = "/"+lat+"/"+lng;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_LOJAS + params);            
  }

  findIconeCerveja(cdmarca: any, cdtipo: any, cdmedida: any) {
    let params: string = "/"+cdmarca+"/"+cdtipo+"/"+cdmedida;
    return this.getHttp(AppSettings.API_ENDPOINT + AppSettings.GET_ICONE + params);            
  }

  getUserJaValidouPreco(cdproduto){    
    let params: URLSearchParams = new URLSearchParams();
    params.set('cdproduto',cdproduto);
    params.set('cdusuario',this._cdusuario.value);
    return  this.getHttpParamns(AppSettings.API_ENDPOINT + AppSettings.GET_VALIDA_PRECO, params);
  }

  getQtdeValidarPreco(cdproduto){    
    let params: URLSearchParams = new URLSearchParams();
    params.set('cdproduto',cdproduto);
    return  this.getHttpParamns(AppSettings.API_ENDPOINT + AppSettings.GET_VALIDA_PRECO_QTDE, params);
  }
  
  indiqueMarca(marca: string){
    let jsonDado = {
      cdusuario: this._cdusuario.value,
      marca: marca,
      dtcadastro: new Date()
    };
    
    return  this.http
                .post(AppSettings.API_ENDPOINT + AppSettings.POST_INDIQUE_MARCA, 
                    JSON.stringify(jsonDado), 
                    {headers: contentHeaders}
                ).toPromise();
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