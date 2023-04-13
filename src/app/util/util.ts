import { inject } from '@angular/core';
import { SystemService } from '../core/system.service';

/**
 * 分组
 *
 * @param array 数组
 * @param key 生成key的方式
 * @param value  生成值的方式
 * @returns 按key分组的Map
 */
export function groupBy<O, K extends string | number | symbol, V>(
  array: O[],
  key: (origin: O) => K,
  value: (origin: O) => V
): Record<K, V[]> {
  return array.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(value(item));
    return groups;
  }, {} as Record<K, V[]>);
}

/**
 * 获取标题
 * 
 * @param title 标题key 
 * @returns 标题
 */
export function getTitle(title?: string): string {
  const system = inject(SystemService);
  return (
    system.langText['MAIN_TITLE'] + (title ? '｜' + system.langText[title] : '')
  );
}
