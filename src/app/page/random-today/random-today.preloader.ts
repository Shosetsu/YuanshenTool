import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { SystemService } from 'src/app/core/system.service';
import { Pool, RollTodayData } from 'src/app/interface/roll-today.storage';

/**
 * 今天树脂刷什么 的 业务预处理模块
 */
@Injectable({ providedIn: 'root' })
export class RandomTodayPreloader implements Resolve<boolean> {
  /** 池子一览 */
  pools!: Pool[];

  /** 储存数据 */
  session!: RollTodayData;

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
  async resolve(): Promise<boolean> {
    // 避免页面模块重复初始化
    if (this.system.loadedModules['rt']) return true;

    // 获取基础池子定义
    this.pools = await fetch('assets/rt/pools.json').then((res) => res.json());

    // 读取本地储存数据
    this.session = this.data.getValue<RollTodayData>(Constants.ROLL_TODAY_KEY, {
      memoried: [],
      filters: { artifacts: true, base: true },
      customPools: [],
    });

    // 存在每日切换的特殊固定池子的生成处理
    // TODO 本地时区与服务器时区不同时会出现问题 <-可我也不知道你哪个服务器
    const today = new Date(new Date().getTime() - 4 * 3_600_000);
    const weekend = today.getDay() === 0;
    const day = weekend ? 0 : (today.getDay() - 1) % 3;

    // 天赋和武器
    const typeList = ['talent', 'weapon'];
    // 区域
    const areaList = ['mond', 'liyue', 'inazuma', 'sumeru'];
    // 循环添加
    typeList.forEach((type) =>
      areaList.forEach((area, aIndex) =>
        this.pools.push({
          value: area + '_' + type,
          label: `RT.${type}_${aIndex + 1}_${weekend ? 'A' : day}`,
          type: 'other',
          target: area + '_' + type + day,
        })
      )
    );

    // 初期化文本以及选中状态
    this.pools.forEach((pool) => {
      pool.label = this.system.langText[pool.label];
      pool.isSelect = Boolean(
        this.session.memoried.find((memo) => memo === pool.value)
      );
    });

    // 通知页面模块初始化结束
    return (this.system.loadedModules['rt'] = true);
  }
}
