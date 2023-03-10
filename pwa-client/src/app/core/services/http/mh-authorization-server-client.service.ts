import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { OAuth2TokenJwt } from 'src/app/shared/models/OAuth2TokenJwt.interface';
import { OAuth2TokenJwtDecoded } from 'src/app/shared/models/OAuth2TokenJwtDecoded.interface';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MhAuthorizationServerClientService {

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

  getTokenWithRefreshToken(refreshToken: string) {
    const url = this.authorizationServerUrl + '/oauth2/token';
    const httpHeaders = new HttpHeaders({ Authorization: this.generateBasicAuthHeader(),'Content-Type':'application/x-www-form-urlencoded' }
    );
    const body = 'grant_type=refresh_token&refresh_token=' + refreshToken;
    return this.http.post<OAuth2TokenJwt>(url, body, {headers: httpHeaders, observe: 'response'});
  }

  getDecodedToken(token: string): Observable<HttpResponse<OAuth2TokenJwtDecoded>> {
    const url = this.authorizationServerUrl + '/oauth2/introspect';
    const httpHeaders = new HttpHeaders({ Authorization: this.generateBasicAuthHeader(),'Content-Type':'application/x-www-form-urlencoded' }
    );
    const body = 'token=' + token;
    return this.http.post<OAuth2TokenJwtDecoded>(url, body, { headers: httpHeaders, observe: 'response' });
  }

  private generateBasicAuthHeader() {
    return 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`);
  }

  private generateBodyAuthorizationCode(code: string) {
    return 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + this.redirectUri;
  }

}
