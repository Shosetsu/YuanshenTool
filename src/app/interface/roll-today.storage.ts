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

export interface Pool {
  value: string;
  label: string;
  type?: 'artifacts' | 'boss' | 'base' | 'other';
  target?: string;
}
