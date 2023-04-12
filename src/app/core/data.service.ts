import { StorageConstants } from '../constants/cosntants';

/**
 * 数据管理服务
 */
export class DataService {
  /**
   * 数据结构定义
   */
  private data: Record<string, string> = {};

  /**
   * 缓存数据定义
   */
  private tempData: Map<string, unknown> = new Map();

  /**
   * 加载本地数据
   */
  loadStorage(): void {
    StorageConstants.storageKeys.map((key) => {
      this.data[key] = localStorage[key];
    });
  }

  /**
   * 保存本地数据
   */
  saveStorage(): void {
    StorageConstants.storageKeys.map((key) => {
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
  getValue<T>(key: string, defaultValue: T): T {
    let value: T;
    try {
      value = JSON.parse(decodeURIComponent(atob(this.data[key])));
    } catch {
      return defaultValue;
    }
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

  setCache<T>(key: string, value: T): void {
    this.tempData.set(key, value);
  }
  getCache<T>(key: string): T {
    return this.tempData.get(key) as T;
  }
}
