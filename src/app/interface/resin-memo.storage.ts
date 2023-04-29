/**
 * 树脂去哪了 储存数据定义
 */
export interface ResinMemoData {
  /**
   * 目前记录的数据
   */
  logs: Record<string, ResinMemo>;
}

export interface ResinMemo {
  status: 'info' | 'edit' | 'new';
  endTime: number;
  lostTime: { now: number; diff: number }[];
}
