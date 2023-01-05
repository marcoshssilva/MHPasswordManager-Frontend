import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { OAuth2TokenJwt } from 'src/app/shared/models/OAuth2TokenJwt.interface';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MhAuthService {

  authorizationServerUrl: string;
  clientId: string;
  clientSecret: string;
  host: string;
  redirectUri: string;

  constructor(
    private http: HttpClient,
  ) {
    this.authorizationServerUrl = environment.authorizationServerUrl;
    this.clientId = environment.clientId;
    this.clientSecret = environment.clientSecret;
    this.redirectUri = environment.redirectUrl;
  }

  getTokenWithAuthorizationCode(code: string): Observable<HttpResponse<OAuth2TokenJwt>> {
    const url = this.authorizationServerUrl + '/oauth2/token';
    const httpHeaders = new HttpHeaders({ Authorization: this.generateBasicAuthHeader(),'Content-Type':'application/x-www-form-urlencoded' }
    );

    return this.http.post<OAuth2TokenJwt>(
      url, this.generateBodyAuthorizationCode(code), { headers: httpHeaders, observe: 'response'});
  }

  private generateBasicAuthHeader() {
    return 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`);
  }

  private generateBodyAuthorizationCode(code: string) {
    return 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + this.redirectUri;
  }

}
