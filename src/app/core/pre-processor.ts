import { Constants, StorageConstants } from '../constants/cosntants';
import { SystemData } from '../interface/system.storage';
import { DataService } from './data.service';
import { SystemService } from './system.service';
import { inject } from '@angular/core';

/**
 * 全局预处理
 *
 * @returns
 */
export const loadInitial = async (): Promise<boolean> => {
  /** 系统服务 */
  const system = inject(SystemService);
  /** 数据服务 */
  const data = inject(DataService);

  // 避免重复初始化
  if (system.isInit) return true;

  // 加载本地储存数据
  data.loadStorage();

  // 检查储存数据版本是否一致
  if (
    data.getValue<number>(Constants.STORAGE_VERSION_KEY, 0) !==
    StorageConstants.storageVerison
  ) {
    // 初始化储存数据
    data.clearStorage();
    data.saveValue<number>(
      Constants.STORAGE_VERSION_KEY,
      StorageConstants.storageVerison
    );
  }

  // 获取系统数据
  const systemData = data.getValue<SystemData>(Constants.SYSTEM_KEY, {});

  // TODO 等做了navi再放出来
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
  data.saveValue(Constants.SYSTEM_KEY, systemData);
  // }

  //通过语言获取文本配置
  system.langText = await fetch(
    `assets/lang/lang_${systemData.language}.json?new`
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
  document.title = system.langText['MAIN_TITLE'];

  // 通知初始化结束
  return (system.isInit = true);
};
