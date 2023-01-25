import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MhAuthorizationHelperService } from '../mh-authorization-helper.service';
import { UserDataLocal } from 'src/app/shared/models/UserDataLocal.interface';
import { environment } from 'src/environments/environment';
import { MhAuthorizationServerClientService } from '../http/mh-authorization-server-client.service';


@Injectable({
    providedIn: 'root'
})
export class JwtInjectorsInterceptor implements HttpInterceptor {

    private urlsToInject = [environment.apiGatewayUrl];

    constructor(
      private authorizationHelper: MhAuthorizationHelperService,
      private authorizationClient: MhAuthorizationServerClientService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = JSON.parse(localStorage.getItem(this.authorizationHelper.AUTH_KEY_USER_LOCAL)) as UserDataLocal;

        if (user && this.hasAnyOfInUrl(req.url) && this.tokenNotExpired(user.k4)) {
          const reqWithJwt = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + user.k2)});
          return next.handle(reqWithJwt);
        }

        if (user && this.hasAnyOfInUrl(req.url) && this.tokenExpired(user.k4)) {
          return this.authorizationClient.getTokenWithRefreshToken(user.k1)
          .pipe(switchMap(data => {
            this.authorizationHelper.saveAuthentication(data.body);
            const reqWithJwtRenewed = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + data.body.access_token)});
            return next.handle(reqWithJwtRenewed);
          }));
        }

        return next.handle(req);
    }

    private hasAnyOfInUrl(requestedUrl: string) {
      let res = false;
      this.urlsToInject.forEach(url => requestedUrl.includes(url) ? res = true : () => {});
      return res;
    }

    private tokenNotExpired(data: Date): boolean {
      return new Date(data).getTime() > new Date().getTime();
    }

    private tokenExpired(data: Date): boolean {
      return !this.tokenNotExpired(data);
    }
}

export const JwtInjectorsInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInjectorsInterceptor,
    multi: true
};
