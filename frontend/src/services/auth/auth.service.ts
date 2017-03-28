import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Auth0Vars } from './auth0-variables';
import { SharingService} from '../sharing-service';
import { Usuario } from '../../models/usuario';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Avoid name not found warnings
declare var Auth0: any;
declare var Auth0Lock: any;

var options = {
  theme: {
    logo: 'https://image.freepik.com/free-vector/fresh-beer-pub_23-2147504791.jpg',
    primaryColor: 'green'
  },
  languageDictionary: {   
    title: "Viva Cerveja"
  },
  language: "pt-BR",
  closable: false
};

@Injectable()
export class AuthService {

  jwtHelper: JwtHelper = new JwtHelper();
  auth0 = new Auth0({clientID: Auth0Vars.AUTH0_CLIENT_ID, domain: Auth0Vars.AUTH0_DOMAIN });
  lock = new Auth0Lock(Auth0Vars.AUTH0_CLIENT_ID, Auth0Vars.AUTH0_DOMAIN, options);
  
  refreshSubscription: any;
  user: Object;
  zoneImpl: NgZone;
  accessToken: string;
  idToken: string;

  storage: Storage = new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' });

  devicetoken: string;
  lat: number;
  lng: number;
  cdusuario: string;

  //utilizado para receber a callback de quando ocorreu o login
  public onlogin: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private authHttp: AuthHttp, 
              zone: NgZone,
              public sharingService: SharingService) {
    this.zoneImpl = zone;


    this.sharingService.devicetoken.subscribe(token=> {
      this.devicetoken = token;
    });

    this.sharingService.lat.subscribe(lat => {
      this.lat = lat;
    });

    this.sharingService.lng.subscribe(lng=> {
      this.lng = lng;
    });

    this.sharingService.cdusuario.subscribe(cdusuario=>{
      this.cdusuario = cdusuario;
    });

    // Check if there is a profile saved in local storage
    this.storage.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

    this.storage.get('access_token').then(token => {
      this.accessToken = token;
    });

    this.lock.on('authenticated', authResult => {
      console.log("authenticated: "+JSON.stringify(authResult));
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.storage.set('access_token', authResult.accessToken);
        this.storage.set('id_token', authResult.idToken);
        this.storage.set('refresh_token', authResult.refreshToken);
        this.accessToken = authResult.accessToken;
        this.idToken = authResult.idToken;

        // Fetch profile information
        this.lock.getUserInfo(this.accessToken, (error, profile) => {
          if (error) {
            // Handle error
            alert(error);
            return;
          }

          profile.user_metadata = profile.user_metadata || {};          
          this.storage.set('profile', JSON.stringify(profile));
          this.user = profile;
          this.inserirUsuario(profile);
        });

        this.lock.hide();

        this.zoneImpl.run(() => this.user = authResult.profile);
        // // Schedule a token refresh
        this.scheduleRefresh();
        
        this.onlogin.next(true);
      } else {
        this.onlogin.next(false);
      }      
    });
  }

  public inserirUsuario(profile){
    let usuario: Usuario = new Usuario();
    usuario.cdusuario = profile.userId;
    usuario.nome = profile.name;
    usuario.avatar = profile.picture;
    usuario.devicetoken = this.devicetoken;
    usuario.lat = this.lat;
    usuario.lng = this.lng;
    
    this.sharingService.insereUsuario(usuario);
  }

  public authenticated() { 
    return !!this.idToken;
    //return tokenNotExpired('id_token', this.idToken);
  }  

  public login() {
    this.lock.show();
  }
  
  public logout() {
    this.storage.remove('profile');
    this.storage.remove('access_token');
    this.storage.remove('id_token');
    this.idToken = null;
    this.storage.remove('refresh_token');
    this.zoneImpl.run(() => this.user = null);
    // Unschedule the token refresh
    this.unscheduleRefresh();
  }

  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token

    let source = Observable.of(this.idToken).flatMap(
      token => {
        console.log('token here', token);
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);
        
        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));
        
        return Observable.interval(delay);
      });
      
    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.authenticated()) {
      let source = Observable.of(this.idToken).flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;
          
          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay);
        });
      
        // Once the delay time from above is
        // reached, get a new JWT and schedule
        // additional refreshes
        source.subscribe(() => {
          this.getNewJwt();
          this.scheduleRefresh();
        });
    }
  }

  public unscheduleRefresh() {
    // Unsubscribe fromt the refresh
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  public getNewJwt() {
    // Get a new JWT from Auth0 using the refresh token saved
    // in local storage
    this.storage.get('refresh_token').then(token => {
      this.auth0.refreshToken(token, (err, delegationRequest) => {
        if (err) {
          alert(err);
        }
        this.storage.set('id_token', delegationRequest.id_token);
        this.idToken = delegationRequest.id_token;
      });
    }).catch(error => {
      console.log(error);
    });
  }
}