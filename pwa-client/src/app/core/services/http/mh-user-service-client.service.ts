import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountData } from 'src/app/shared/models/AccountData.interface';
import { UserDataLocal } from 'src/app/shared/models/UserDataLocal.interface';
import { environment } from 'src/environments/environment';
import { MhAuthorizationHelperService } from '../mh-authorization-helper.service';

@Injectable({
  providedIn: 'root'
})
export class MhUserServiceClientService {

  private serviceUrl = `${environment.apiGatewayUrl}/users`;

  constructor(
    private http: HttpClient,
    private authorizationHelper: MhAuthorizationHelperService
  ) { }

  getAccountData(email: string) {
    return this.http.get<AccountData>(`${this.serviceUrl}/account/${email}/data`, { observe: 'response' });
  }
}
