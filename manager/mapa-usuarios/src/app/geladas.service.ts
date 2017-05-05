import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

export const contentHeaders = new Headers();
contentHeaders.append('Content-Type','application/json');

// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

const MANAGER_ENDPOINT = 'http://node-express-geladas.misais4yjc.us-west-2.elasticbeanstalk.com/manager/';
const GET_USER_NO_RAIO = "usernoraio";
const GET_QTDE_USER_NO_RAIO = "qtdeusernoraio";
const GET_LOJAS = "lojas";


@Injectable()
export class GeladasService {

  constructor(public http: Http) { 

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
