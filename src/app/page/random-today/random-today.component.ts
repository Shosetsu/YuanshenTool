import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { Pool, RollTodayData } from 'src/app/interface/roll-today.storage';

/**
 * 今天树脂刷什么
 */
@Component({
  selector: 'app-random-today',
  templateUrl: './random-today.component.html',
  styleUrls: ['./random-today.component.scss'],
})
export class RandomTodayComponent implements OnInit {
  memoried: string[] = [];
  filters: { [type: string]: boolean } = {};

  pools: Pool[] = [
    { value: 'anemo', label: '风套/少女', type: 'artifacts' },
    { value: 'cryo', label: '冰套/水套', type: 'artifacts' },
    { value: 'electro', label: '如雷/平雷', type: 'artifacts' },
    { value: 'pyro', label: '魔女/幡然醒悟', type: 'artifacts' },
    { value: 'burst', label: '宗室/骑士道', type: 'artifacts' },
    { value: 'geo', label: '岩套/逆飞', type: 'artifacts' },
    { value: 'physical', label: '千岩/苍白', type: 'artifacts' },
    { value: 'electro2', label: '绝缘/追忆', type: 'artifacts' },
    { value: 'heal', label: '华馆/海染', type: 'artifacts' },
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
  ];
  customPools: Pool[] = [];

  cusPoolModalFlag = false;

  result?: Pool = undefined;
  resultName = '';

  get rolledList(): string[] {
    return this.memoried.filter(
      (item) =>
        this.filters[this.pools.find((e) => e.value === item)?.type || ''] ||
        this.customPools.find((e) => e.value === item)
    );
  }

  get availableList(): Pool[] {
    return [...this.pools, ...this.customPools].filter(
      (pool) => !pool.type || this.filters[pool.type]
    );
  }

  constructor(private data: DataService) {}

  ngOnInit(): void {
    const session = this.data.getValue<RollTodayData>(Constants.ROLL_TODAY_KEY);

    this.memoried = session?.memoried || [];
    this.filters = session?.filters || { artifacts: true, base: true };
    this.customPools = session?.customPools || [
      { label: '征讨领域', value: 'cus1', target: 'resin' },
    ];

    // Daily
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
  }

  isCheckedPool(key: string): boolean {
    return this.memoried.includes(key);
  }

  changePool(key: string, froceStatus: '0' | '1' | null = null): void {
    const hasIndex = this.memoried.indexOf(key);
    if ((hasIndex !== -1 || froceStatus === '0') && froceStatus !== '1') {
      this.memoried.splice(hasIndex, 1);
    } else if (hasIndex === -1) {
      this.memoried.push(key);
    }
    this.save();
  }

  save(): void {
    this.data.saveValue(Constants.ROLL_TODAY_KEY, {
      memoried: this.memoried,
      filters: this.filters,
      customPools: this.customPools,
    } as RollTodayData);
  }

  roll(): void {
    const rolled =
      this.rolledList[Math.floor(Math.random() * this.rolledList.length)];
    this.result = this.availableList.find((e) => e.value === rolled);
    console.log(this.result?.label);
  }

  isAllSelect(): boolean {
    return this.availableList.every((pool) =>
      this.memoried.includes(pool.value)
    );
  }

  checkAll(): void {
    if (this.isAllSelect()) {
      this.availableList.map((pool) => this.changePool(pool.value, '0'));
    } else {
      this.availableList.map((pool) => this.changePool(pool.value, '1'));
    }
  }

  reverse(): void {
    this.availableList.map((pool) => this.changePool(pool.value));
  }

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

  outputProfile(): string {
    return btoa(JSON.stringify(this.memoried));
  }

  createPoolSetting(label: string): void {
    this.customPools.push({
      label,
      value: 'cus' + new Date().getTime(),
      target: 'resin',
    });
    this.save();
    this.cusPoolModalFlag = false;
  }

  removePool(pool: Pool): void {
    const hasIndex = this.customPools.indexOf(pool);
    this.customPools.splice(hasIndex, 1);
    this.changePool(pool.value, '0');
    this.save();
  }
}
