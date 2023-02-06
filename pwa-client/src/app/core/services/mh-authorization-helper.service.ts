import {Injectable} from '@angular/core';
import {OAuth2TokenJwt} from 'src/app/shared/models/OAuth2TokenJwt.interface';
import {UserDataLocal} from 'src/app/shared/models/UserDataLocal.interface';
import {LocalStorageService} from './storage/local-storage.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MhAuthorizationHelperService {

  readonly AUTH_KEY_USER_LOCAL = 'data';

  constructor(
    private storage: LocalStorageService,
  ) {
  }

  async saveAuthentication(token: OAuth2TokenJwt): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setSeconds(new Date().getSeconds() + token.expires_in);
    const userData: UserDataLocal = {
      k1: token.refresh_token,
      k2: token.access_token,
      k3: null,
      k4: expirationDate
    };
    await this.storage.set(this.AUTH_KEY_USER_LOCAL, userData);
  }

  async getAuthentication(): Promise<UserDataLocal> {
    return (await this.storage.get(this.AUTH_KEY_USER_LOCAL)) as UserDataLocal;
  }

  async logout(): Promise<void> {
    this.storage.removeKey(this.AUTH_KEY_USER_LOCAL).then(() => window.location.href = environment.authorizationServerUrl + '/logout');
  }
}
