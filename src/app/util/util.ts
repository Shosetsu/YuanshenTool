/**
 * 工具集
 */
export class Util {
  /**
   * 分组
   *
   * @param arr 数组
   * @param key 生成key的方式
   * @param value  生成值的方式
   * @returns 按key分组的Map
   */
  static groupBy<O, K extends keyof any, V>(
    array: O[],
    key: (origin: O) => K,
    value: (origin: O) => V
  ): Record<K, V[]> {
    return array.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(value(item));
      return groups;
    }, {} as Record<K, V[]>);
  }
}
