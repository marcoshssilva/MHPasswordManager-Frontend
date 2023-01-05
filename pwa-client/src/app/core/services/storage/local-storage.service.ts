import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  async get(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  async set(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  nonAsyncGet(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

}
