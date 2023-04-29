import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { SystemService } from 'src/app/core/system.service';
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
  /** 选择池子一览 */
  private pools: Pool[] = this.route.snapshot.data['pools'];

  /** 用户自定义池子一览 */
  session = this.data.getValue<RollTodayData>(Constants.ROLL_TODAY_KEY, {
    memoried: [],
    filters: { artifacts: true, base: true },
    customPools: [],
  });

  /** 分组后标准池子一览 */
  processedPools: Record<string, Pool[]> = {};

  /** 文本管理 */
  text = this.system.langText;

  /** 无能的ObjectKeys */
  keys = Object.keys;

  /** 自定义池子弹窗状态 */
  cusPoolModalFlag = false;

  /** 本次随机结果 */
  result?: Pool;

  /** 有效随机范围（用户在当前筛选条件下选中的一览） */
  get rolledList(): string[] {
    return this.availableList
      .filter((item) => item.isSelect)
      .map((item) => item.value);
  }

  /** 所有可用的池子（在当前筛选条件下的一览） */
  get availableList(): Pool[] {
    return [...this.pools, ...this.session.customPools].filter(
      (pool) => !pool.type || this.session.filters[pool.type]
    );
  }

  /**
   * 构造器
   *
   * @param data 数据管理服务
   * @param system 系统服务
   * @param route 路由服务
   */
  constructor(
    private data: DataService,
    private system: SystemService,
    private route: ActivatedRoute
  ) {}

  /**
   * 画面初始处理
   */
  ngOnInit(): void {
    // 分组
    this.processedPools = groupBy(
      this.pools,
      (o) => o.type || '',
      (o) => o
    );
  }

  /**
   * 切换池子的选择状态
   *
   * @param key 池子的键
   * @param froceStatus （可选）无论如何一定要把它设置成的状态
   */
  changePool(pool: Pool, froceStatus: boolean | null = null): void {
    if (froceStatus != null) {
      pool.isSelect = froceStatus;
    } else {
      pool.isSelect = !pool.isSelect;
    }
    this.save();
  }

  /**
   * 检查是否全选（在当前的筛选状态下）
   *
   * @returns 是or否
   */
  isAllSelect(): boolean {
    return this.availableList.every((pool) => pool.isSelect);
  }

  /**
   * 将其全选or全不选（在当前的筛选状态下）
   */
  checkAll(): void {
    if (this.isAllSelect()) {
      this.availableList.map((pool) => this.changePool(pool, false));
    } else {
      this.availableList.map((pool) => this.changePool(pool, true));
    }
  }

  /**
   * 反选
   */
  reverse(): void {
    this.availableList.map((pool) => this.changePool(pool));
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
        this.pools.forEach((pool) => {
          pool.isSelect = Boolean(result.find((memo) => memo === pool.value));
        });
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
    return btoa(JSON.stringify(this.getSelected()));
  }

  /**
   * 创建自定义池子
   *
   * @param label 池子名字
   */
  createPoolSetting(label: string): void {
    this.session.customPools.push({
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
   * @param pool 池子名字
   */
  removePool(pool: Pool): void {
    const hasIndex = this.session.customPools.indexOf(pool);
    this.session.customPools.splice(hasIndex, 1);
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
    this.data.saveValue<RollTodayData>(Constants.ROLL_TODAY_KEY, {
      memoried: this.getSelected(),
      filters: this.session.filters,
      customPools: this.session.customPools,
    });
  }

  /**
   * 储存用字符串生成处理
   *
   * @returns 储存用字符串
   */
  getSelected(): string[] {
    return this.pools.filter((pool) => pool.isSelect).map((pool) => pool.value);
  }
}
