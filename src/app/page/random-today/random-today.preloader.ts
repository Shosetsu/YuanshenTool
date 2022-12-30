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
    /** 避免重复初始化 */
    if (this.system.loadedModules['rt']) return true;
    this.pools = await fetch('assets/rt/pools.json').then((res) => res.json());

    // 读取本地储存数据
    this.session = this.data.getValue<RollTodayData>(Constants.ROLL_TODAY_KEY, {
      memoried: [],
      filters: { artifacts: true, base: true },
      customPools: [],
    });

    // 存在每日切换的特殊固定池子的生成处理
    const today = new Date(new Date().getTime() - 4 * 3_600_000);
    const weekend = today.getDay() === 0;
    const day = weekend ? 0 : (today.getDay() - 1) % 3;

    this.pools.push({
      value: 'mond_talent',
      label: `RT.talent_1_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'mond_talent' + day,
    });
    this.pools.push({
      value: 'liyue_talent',
      label: `RT.talent_2_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'liyue_talent' + day,
    });
    this.pools.push({
      value: 'inazuma_talent',
      label: `RT.talent_3_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'inazuma_talent' + day,
    });
    this.pools.push({
      value: 'sumeru_talent',
      label: `RT.talent_4_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'sumeru_talent' + day,
    });
    this.pools.push({
      value: 'mond_weapon',
      label: `RT.weapon_1_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'mond_weapon' + day,
    });
    this.pools.push({
      value: 'liyue_weapon',
      label: `RT.weapon_2_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'liyue_weapon' + day,
    });
    this.pools.push({
      value: 'inazuma_weapon',
      label: `RT.weapon_3_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'inazuma_weapon' + day,
    });
    this.pools.push({
      value: 'sumeru_weapon',
      label: `RT.weapon_4_${weekend ? 'A' : day}`,
      type: 'other',
      target: 'sumeru_weapon' + day,
    });

    // 初期化文本以及选中状态
    this.pools.forEach((pool) => {
      pool.label = this.system.langText[pool.label];
      pool.isSelect = Boolean(
        this.session.memoried.find((memo) => memo === pool.value)
      );
    });

    return (this.system.loadedModules['rt'] = true);
  }
}
