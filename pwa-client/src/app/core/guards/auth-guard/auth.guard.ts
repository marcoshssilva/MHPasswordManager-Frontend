import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {MhAuthorizationHelperService} from '../../services/mh-authorization-helper.service';
import {MhAuthorizationServerClientService} from '../../services/http/mh-authorization-server-client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private mhAuthorizationHelperService: MhAuthorizationHelperService,
    private mhAuthorizationServerClient: MhAuthorizationServerClientService
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.mhAuthorizationHelperService.getAuthentication()
      .then(auth => {
        if (auth) {
          // verify on Authorization Server if token is valid
          return this.mhAuthorizationServerClient
            .getDecodedToken(auth.k2)
            .toPromise()
            .then(tokenDecoded => {
              if (!tokenDecoded.body.active) {
                this.redirectToAuthorizePage().then(r => {
                });
              }
              return tokenDecoded.body.active;
            });
        } else {
          this.redirectToAuthorizePage().then(r => {
          });
          return false;
        }
      });
  }

  private async redirectToAuthorizePage() {
    const clientId = environment.clientId;
    const url = environment.authorizationServerUrl + '/oauth2/authorize?response_type=code'
      + '&client_id=' + clientId
      + '&redirect_uri=' + environment.redirectUrl
      + '&state=' + 'login'
      + '&scope=' + 'user:canSelfRead user:canSelfWrite';

    window.location.href = encodeURI(url);
  }
}
