import { StorageConstants } from '../constants/cosntants';

/**
 * 数据管理服务
 */
export class DataService {
  /**
   * 数据结构定义
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private data: Record<string, any> = {};

  /**
   * 缓存数据定义
   */
  private tempData: Map<string, unknown> = new Map();

  /**
   * 加载本地数据
   */
  loadStorage(): void {
    try {
      this.data = JSON.parse(localStorage[StorageConstants.storageKey]);
    } catch {
      this.data = {};
    }
  }

  /**
   * 保存本地数据
   */
  saveStorage(): void {
    localStorage[StorageConstants.storageKey] = JSON.stringify(this.data);
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
    return this.data[key] ?? defaultValue;
  }

  /**
   * 保存数据
   *
   * @param key 数据键名
   * @param value 数据
   */
  saveValue<T>(key: string, value: T): void {
    this.data[key] = value;
    this.saveStorage();
  }

  setCache<T>(key: string, value: T): void {
    this.tempData.set(key, value);
  }
  getCache<T>(key: string): T {
    return this.tempData.get(key) as T;
  }
}
