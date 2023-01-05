import { Injectable } from '@angular/core';
import { UserDataLocal } from 'src/app/shared/models/UserDataLocal.interface';
import { LocalStorageService } from './storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MhAuthorizationHelperService {

  readonly AUTH_KEY_USER_LOCAL = 'data';

  constructor(
    private storage: LocalStorageService
  ) { }

  async saveAuthentication(userData: UserDataLocal): Promise<void> {
    await this.storage.set(this.AUTH_KEY_USER_LOCAL, userData);
  }

  async getAuthentication(): Promise<UserDataLocal> {
    return (await this.storage.get(this.AUTH_KEY_USER_LOCAL)) as UserDataLocal;
  }

}
