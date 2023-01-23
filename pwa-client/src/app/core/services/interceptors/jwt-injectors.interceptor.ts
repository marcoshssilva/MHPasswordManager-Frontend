import { Observable } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MhAuthorizationHelperService } from '../mh-authorization-helper.service';
import { UserDataLocal } from 'src/app/shared/models/UserDataLocal.interface';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JwtInjectorsInterceptor implements HttpInterceptor {

    private urlsToInject = [environment.apiGatewayUrl];

    constructor(
      private authorizationHelper: MhAuthorizationHelperService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = JSON.parse(localStorage.getItem(this.authorizationHelper.AUTH_KEY_USER_LOCAL)) as UserDataLocal;
        if (user && user.k2 && this.hasAnyOfInUrl(req.url)) {
          const reqWithJwt = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + user.k2)});
          console.log(reqWithJwt);
          return next.handle(reqWithJwt);
        }
        return next.handle(req);
    }

    private hasAnyOfInUrl(requestedUrl: string) {
      let res = false;
      this.urlsToInject.forEach(url => requestedUrl.includes(url) ? res = true : () => {});
      return res;
    }
}

export const JwtInjectorsInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInjectorsInterceptor,
    multi: true
};
