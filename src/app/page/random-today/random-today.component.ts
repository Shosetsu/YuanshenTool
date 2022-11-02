import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { Pool, RollTodayData } from 'src/app/interface/roll-today.storage';
import { groupBy } from 'src/app/util/util';

/**
 * 今天树脂刷什么 页面模块
 */
@Component({
  selector: 'app-random-today',
  templateUrl: './random-today.component.html',
  styleUrls: ['./random-today.component.scss'],
})
export class RandomTodayComponent implements OnInit {
  /** 用户选择的池子一览（仅储存用） */
  private memoried: string[] = [];

  /** 用户使用的筛选状态 */
  filters: Record<string, boolean> = {};

  /** 选择池子一览 */
  private pools: Pool[] = [
    { value: 'anemo', label: '风套/少女', type: 'artifacts' },
    { value: 'cryo', label: '冰套/水套', type: 'artifacts' },
    { value: 'electro', label: '如雷/平雷', type: 'artifacts' },
    { value: 'pyro', label: '魔女/幡然醒悟', type: 'artifacts' },
    { value: 'burst', label: '宗室/骑士道', type: 'artifacts' },
    { value: 'geo', label: '岩套/逆飞', type: 'artifacts' },
    { value: 'physical', label: '千岩/苍白', type: 'artifacts' },
    { value: 'electro2', label: '绝缘/追忆', type: 'artifacts' },
    { value: 'heal', label: '华馆/海染', type: 'artifacts' },
    { value: '2atk', label: '辰砂/余响', type: 'artifacts' },
    { value: 'dendro', label: '深林/饰金', type: 'artifacts' },
    { value: 'gold', label: '金币地脉花', type: 'base' },
    { value: 'exp', label: '经验地脉花', type: 'base' },
    { value: 'boss_anemo', label: '无相之风', type: 'boss' },
    { value: 'boss_electro', label: '无相之雷', type: 'boss' },
    { value: 'boss_geo', label: '无相之岩', type: 'boss' },
    { value: 'boss_cryo2', label: '无相之冰', type: 'boss' },
    { value: 'boss_pyro2', label: '无相之火', type: 'boss' },
    { value: 'boss_hydro2', label: '无相之水', type: 'boss' },
    { value: 'boss_cryo', label: '急冻树', type: 'boss' },
    { value: 'boss_pyro', label: '爆炎树', type: 'boss' },
    { value: 'boss_hydro', label: '纯水精灵', type: 'boss' },
    { value: 'boss_electro2', label: '雷音权现', type: 'boss' },
    { value: 'boss_geo2', label: '古岩龙蜥', type: 'boss' },
    { value: 'boss_cryo3', label: '魔偶剑鬼', type: 'boss' },
    { value: 'boss_physical', label: '恒常机关阵列', type: 'boss' },
    { value: 'boss_wolf', label: '黄金王兽', type: 'boss' },
    { value: 'boss_coral', label: '深海龙蜥之群', type: 'boss' },
    { value: 'boss_ruin', label: '遗迹巨蛇', type: 'boss' },
    { value: 'boss_dendro', label: '翠翎恐蕈', type: 'boss' },
    { value: 'boss_electro3', label: '掣电树', type: 'boss' },
    { value: 'boss_physical2', label: '兆载永劫龙兽', type: 'boss' },
    { value: 'boss_physical3', label: '半永恒统辖矩阵', type: 'boss' },
    { value: 'boss_dendro2', label: '无相之草', type: 'boss' },
  ];

  /** 分类后标准池子一览 */
  processedPools: Record<string, Pool[]> = {};

  /** 无能的ObjectKeys */
  keys = Object.keys;

  /** 用户自定义池子一览 */
  customPools: Pool[] = [];

  /** 自定义池子弹窗状态 */
  cusPoolModalFlag = false;

  /** 本次随机结果 */
  result?: Pool = undefined;

  /** 有效随机范围（用户在当前筛选条件下选中的一览） */
  get rolledList(): string[] {
    return this.memoried.filter(
      (item) =>
        this.filters[this.pools.find((e) => e.value === item)?.type || ''] ||
        this.customPools.find((e) => e.value === item)
    );
  }

  /** 所有可用的池子（在当前筛选条件下的一览） */
  get availableList(): Pool[] {
    return [...this.pools, ...this.customPools].filter(
      (pool) => !pool.type || this.filters[pool.type]
    );
  }

  /**
   * 构造器
   *
   * @param data 数据管理服务
   */
  constructor(private data: DataService) {}

  /**
   * 画面初始处理
   */
  ngOnInit(): void {
    // 读取本地储存数据
    const session = this.data.getValue<RollTodayData>(Constants.ROLL_TODAY_KEY);
    // 并处理（不存在时赋予默认值）
    this.memoried = session?.memoried || [];
    this.filters = session?.filters || { artifacts: true, base: true };
    this.customPools = session?.customPools || [
      { label: '征讨领域', value: 'cus1', target: 'resin' },
    ];

    // 存在每日切换的特殊固定池子的生成处理
    const today = new Date(new Date().getTime() - 4 * 3_600_000);
    const weekend = today.getDay() === 0;
    const day = weekend ? 0 : (today.getDay() - 1) % 3;

    this.pools.push({
      value: 'mond_talent',
      label: `蒙德天赋（${weekend ? '全' : ['自由', '抗争', '诗文'][day]}）`,
      type: 'other',
      target: 'mond_talent' + day,
    });
    this.pools.push({
      value: 'liyue_talent',
      label: `璃月天赋（${weekend ? '全' : ['繁荣', '勤劳', '黄金'][day]}）`,
      type: 'other',
      target: 'liyue_talent' + day,
    });
    this.pools.push({
      value: 'inazuma_talent',
      label: `稻妻天赋（${weekend ? '全' : ['浮世', '风雅', '天光'][day]}）`,
      type: 'other',
      target: 'inazuma_talent' + day,
    });
    this.pools.push({
      value: 'sumeru_talent',
      label: `须弥天赋（${weekend ? '全' : ['诤言', '巧思', '笃行'][day]}）`,
      type: 'other',
      target: 'sumeru_talent' + day,
    });
    this.pools.push({
      value: 'mond_weapon',
      label: `蒙德武器（${weekend ? '全' : ['碎片', '牙齿', '锁链'][day]}）`,
      type: 'other',
      target: 'mond_weapon' + day,
    });
    this.pools.push({
      value: 'liyue_weapon',
      label: `璃月武器（${weekend ? '全' : ['柱子', '丹药', '天星'][day]}）`,
      type: 'other',
      target: 'liyue_weapon' + day,
    });
    this.pools.push({
      value: 'inazuma_weapon',
      label: `稻妻武器（${weekend ? '全' : ['珊瑚', '怀玉', '面具'][day]}）`,
      type: 'other',
      target: 'inazuma_weapon' + day,
    });
    this.pools.push({
      value: 'sumeru_weapon',
      label: `须弥武器（${weekend ? '全' : ['金符', '盘子', '徽章'][day]}）`,
      type: 'other',
      target: 'sumeru_weapon' + day,
    });

    this.processedPools = groupBy(
      this.pools,
      (o) => o.type || '',
      (o) => o
    );
  }

  /**
   * 是否为选中的池子
   *
   * @param key 池子的键
   * @returns 是or否
   */
  isCheckedPool(key: string): boolean {
    return this.memoried.includes(key);
  }

  /**
   * 切换池子的选择状态
   *
   * @param key 池子的键
   * @param froceStatus （可选）无论如何一定要把它设置成的状态
   */
  changePool(key: string, froceStatus: '0' | '1' | null = null): void {
    const hasIndex = this.memoried.indexOf(key);
    if (hasIndex !== -1 && froceStatus !== '1') {
      this.memoried.splice(hasIndex, 1);
    } else if (hasIndex === -1) {
      this.memoried.push(key);
    }
    this.save();
  }

  /**
   * 检查是否全选（在当前的筛选状态下）
   *
   * @returns 是or否
   */
  isAllSelect(): boolean {
    return this.availableList.every((pool) =>
      this.memoried.includes(pool.value)
    );
  }

  /**
   * 将其全选or全不选（在当前的筛选状态下）
   */
  checkAll(): void {
    if (this.isAllSelect()) {
      this.availableList.map((pool) => this.changePool(pool.value, '0'));
    } else {
      this.availableList.map((pool) => this.changePool(pool.value, '1'));
    }
  }

  /**
   * 反选
   */
  reverse(): void {
    this.availableList.map((pool) => this.changePool(pool.value));
  }

  /**
   * 读取外部配置信息
   *
   * @param profile 配置信息（编码后）
   */
  loadProfile(profile: string): void {
    try {
      const input: string[] = JSON.parse(atob(profile));
      const result = input.filter((item) =>
        this.pools.find((pool) => pool.value === item)
      );
      if (result) {
        this.memoried = result;
        this.save();
      }
    } catch (e) {
      // TODO output error!
    }
  }

  /**
   * 提供外部配置信息
   *
   * @returns 配置信息（编码后）
   */
  outputProfile(): string {
    return btoa(JSON.stringify(this.memoried));
  }

  /**
   * 创建自定义池子
   *
   * @param label 池子名字
   */
  createPoolSetting(label: string): void {
    this.customPools.push({
      label,
      value: 'cus' + new Date().getTime(),
      target: 'resin',
    });
    this.save();
    this.cusPoolModalFlag = false;
  }

  /**
   * 删除自定义池子
   *
   * @param label 池子名字
   */
  removePool(pool: Pool): void {
    const hasIndex = this.customPools.indexOf(pool);
    this.customPools.splice(hasIndex, 1);
    this.changePool(pool.value, '0');
    this.save();
  }

  /**
   * 开选
   */
  roll(): void {
    const rolled =
      this.rolledList[Math.floor(Math.random() * this.rolledList.length)];
    this.result = this.availableList.find((e) => e.value === rolled);
  }

  /**
   * 保存所有数据到本地
   */
  save(): void {
    this.data.saveValue(Constants.ROLL_TODAY_KEY, {
      memoried: this.memoried,
      filters: this.filters,
      customPools: this.customPools,
    } as RollTodayData);
  }
}
