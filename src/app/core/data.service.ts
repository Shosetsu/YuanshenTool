import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Data
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private data: { [key: string]: string } = {};

  constructor() {}

  loadStorage(): void {
    environment.storageKeys.map((key) => {
      this.data[key] = localStorage[key];
    });
  }

  saveStorage(): void {
    environment.storageKeys.map((key) => {
      localStorage[key] = this.data[key];
    });
  }

  clearStorage(): void {
    this.data = {};
    localStorage.clear();
  }

  getValue(key: string): any {
    let value = '';
    try {
      value = JSON.parse(atob(this.data[key]));
    } catch {}
    return value;
  }

  saveValue(key: string, value: any): void {
    this.data[key] = btoa(JSON.stringify(value));
    this.saveStorage();
  }
}
