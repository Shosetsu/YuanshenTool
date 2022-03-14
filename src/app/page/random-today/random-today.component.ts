import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { RollTodayData } from 'src/app/interface/roll-today.storage';

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

  pools = [
    { value: 'anemo', label: '风本/少女', type: 'artifacts' },
    { value: 'cryo', label: '冰本/水本', type: 'artifacts' },
    { value: 'electro', label: '雷本/平雷', type: 'artifacts' },
    { value: 'pyro', label: '火本/幡然醒悟', type: 'artifacts' },
    { value: 'burst', label: '宗室/骑士道', type: 'artifacts' },
    { value: 'geo', label: '岩本/逆飞', type: 'artifacts' },
    { value: 'physical', label: '千岩/苍白', type: 'artifacts' },
    { value: 'electro2', label: '绝缘/追忆', type: 'artifacts' },
    { value: 'heal', label: '华章/海染', type: 'artifacts' },
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
    { value: 'boss_physical', label: '恒常机关', type: 'boss' },
    { value: 'boss_wolf', label: '黄金王狼', type: 'boss' },
    { value: 'boss_coral', label: '双子龙蜥', type: 'boss' },
  ];

  result = '';
  resultName = '';

  constructor(private data: DataService) {}

  ngOnInit(): void {
    const session = this.data.getValue<RollTodayData>(Constants.ROLL_TODAY_KEY);

    this.memoried = session?.memoried || [];
    this.filters = session?.filters || { artifacts: true, base: true };
  }

  isCheckedPool(key: string): boolean {
    return this.memoried.includes(key);
  }

  changePool(key: string): void {
    const hasIndex = this.memoried.indexOf(key);
    if (hasIndex !== -1) {
      this.memoried.splice(hasIndex, 1);
    } else {
      this.memoried.push(key);
      this.save();
    }
  }

  save(): void {
    this.data.saveValue(Constants.ROLL_TODAY_KEY, {
      memoried: this.memoried,
      filters: this.filters,
    } as RollTodayData);
  }

  roll(): void {
    this.result =
      this.memoried[Math.floor(Math.random() * this.memoried.length)];
    this.resultName =
      this.pools.find((e) => e.value === this.result)?.label || '';
  }

  isAllSelect(): boolean {
    return this.pools.every((pool) => this.memoried.includes(pool.value));
  }

  checkAll(): void {
    if (this.isAllSelect()) {
      this.memoried = [];
    } else {
      this.memoried = this.pools.map((pool) => pool.value);
    }
    this.save();
  }

  reverse(): void {
    this.pools.map((pool) => this.changePool(pool.value));
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
}
