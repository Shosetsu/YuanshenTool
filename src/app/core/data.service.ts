import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * 数据管理服务
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  /**
   * 数据结构定义
   */
  private data: { [key: string]: string } = {};

  constructor() {}

  /**
   * 加载本地数据
   */
  loadStorage(): void {
    environment.storageKeys.map((key) => {
      this.data[key] = localStorage[key];
    });
  }

  /**
   * 保存本地数据
   */
  saveStorage(): void {
    environment.storageKeys.map((key) => {
      localStorage[key] = this.data[key];
    });
  }

  /**
   * 清空本地数据
   */
  clearStorage(): void {
    this.data = {};
    localStorage.clear();
  }

  /**
   * 读取数据
   *
   * @param key 数据键名
   * @returns 数据
   */
  getValue<T>(key: string): T {
    let value;
    try {
      value = JSON.parse(decodeURIComponent(atob(this.data[key])));
    } catch {}

    return value;
  }

  /**
   * 保存数据
   *
   * @param key 数据键名
   * @param value 数据
   */
  saveValue<T>(key: string, value: T): void {
    this.data[key] = btoa(encodeURIComponent(JSON.stringify(value)));
    this.saveStorage();
  }
}
