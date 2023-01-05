import { Injectable } from '@angular/core';
import { OAuth2TokenJwtDecoded } from 'src/app/shared/models/OAuth2TokenJwtDecoded.interface';
import { UserDataLocal } from 'src/app/shared/models/UserDataLocal.interface';
import { MhAuthorizationServerClientService } from './http/mh-authorization-server-client.service';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MhAuthorizationHelperService {

  readonly AUTH_KEY_USER_LOCAL = 'data';

  constructor(
    private storage: LocalStorageService,
    private mhAuthorizationServerClient: MhAuthorizationServerClientService
  ) { }

  async saveAuthentication(userData: UserDataLocal): Promise<void> {
    await this.storage.set(this.AUTH_KEY_USER_LOCAL, userData);
  }

  async getAuthentication(): Promise<UserDataLocal> {
    return (await this.storage.get(this.AUTH_KEY_USER_LOCAL)) as UserDataLocal;
  }

  async getDecodedToken(): Promise<OAuth2TokenJwtDecoded> {
    const { k2 } = await this.getAuthentication();
    const { body } = await this.mhAuthorizationServerClient.getDecodedToken(k2).toPromise();
    return body;
  }
}
