/**
 * 今天刷什么 储存数据定义
 */
export interface RollTodayData {
  /**
   * 用户选中的项目
   */
  memoried: string[];
  /**
   * 用户开关的筛选器配置
   */
  filters: { [type: string]: boolean };
  /**
   * 自定义随机池
   */
  customPools: Pool[];
}

/**
 * 池子定义
 */
export interface Pool {
  value: string;
  label: string;
  type?: 'artifacts' | 'boss' | 'base' | 'other';
  target?: string;
}
