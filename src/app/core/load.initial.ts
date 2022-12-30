import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Constants } from '../constants/cosntants';
import { SystemData } from '../interface/system.storage';
import { DataService } from './data.service';
import { SystemService } from './system.service';

/**
 * 预处理模块
 */
@Injectable({ providedIn: 'root' })
export class LoadInitial implements CanActivate {
  /**
   * 构造器
   *
   * @param data 数据管理服务
   * @param system 系统服务
   */
  constructor(private data: DataService, private system: SystemService) {}

  /**
   * 预处理
   *
   * @returns
   */
  async canActivate(): Promise<boolean> {
    /** 避免重复初始化 */
    if (this.system.isInit) return true;

    // 加载本地储存数据
    this.data.loadStorage();

    // 检查储存数据版本是否一致
    if (
      this.data.getValue<number>(Constants.STORAGE_VERSION_KEY, 0) !==
      environment.storageVerison
    ) {
      // 初始化储存数据
      this.data.clearStorage();
      this.data.saveValue<number>(
        Constants.STORAGE_VERSION_KEY,
        environment.storageVerison
      );
    }

    // 获取系统数据
    const systemData = this.data.getValue<SystemData>(Constants.SYSTEM_KEY, {});

    // if (!systemData.language) {
      // 获取优先语言
      systemData.language =
        navigator.languages
          .map((lang) => {
            if (lang === 'zh-CN') {
              return 'zh-cn';
            } else if (lang === 'zh-TW') {
              return 'zh-tw';
            } else if (lang.startsWith('zh')) {
              return 'zh-cn';
            } else if (lang === 'ja') {
              return 'ja';
            }
            return undefined;
          })
          .find((lang) => lang) || 'en';
      this.data.saveValue(Constants.SYSTEM_KEY, systemData);
    // }

    //通过语言获取文本配置
    this.system.langText = await fetch(
      `assets/lang/lang_${systemData.language}.json`
    )
      .then((res) => {
        if (res.status !== 200) {
          throw '';
        }
        return res.json();
      })
      .catch(() =>
        fetch(`assets/lang/lang_zh-cn.json`).then((res) => res.json())
      );
    document.title = this.system.langText['MAIN_TITLE'];

    return (this.system.isInit = true);
  }
}
