import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';

/**
 * 今天树脂刷什么
 */
@Component({
  selector: 'app-random-today',
  templateUrl: './random-today.component.html',
  styleUrls: ['./random-today.component.scss'],
})
export class RandomTodayComponent {
  session: { memoried: string[]; mutil: boolean } =
    this.data.getValue(Constants.ROLL_TODAY_KEY) || {};

  pools = [
    { value: 'anemo', label: '风本/少女' },
    { value: 'cryo', label: '冰本/水本' },
    { value: 'electro', label: '雷本/平雷' },
    { value: 'pyro', label: '火本/幡然醒悟' },
    { value: 'burst', label: '宗室/骑士道' },
    { value: 'geo', label: '岩本/逆飞' },
    { value: 'physical', label: '千岩/苍白' },
    { value: 'electro2', label: '绝缘/追忆' },
    { value: 'heal', label: '防御/海染' },
    { value: 'gold', label: '金币花' },
    { value: 'exp', label: '经验花' },
  ];

  result = '';
  resultName = '';

  constructor(private data: DataService) {}

  isCheckedPool(key: string): boolean {
    return (this.session.memoried || []).includes(key);
  }

  changePool(key: string): void {
    const hasIndex = (this.session.memoried || []).indexOf(key);
    if (hasIndex !== -1) {
      this.session.memoried.splice(hasIndex, 1);
    } else {
      if (!this.session.memoried) this.session.memoried = [];
      this.session.memoried.push(key);
      this.save();
    }
  }

  save(): void {
    this.data.saveValue(Constants.ROLL_TODAY_KEY, this.session);
  }

  roll(): void {
    this.result =
      this.session.memoried[
        Math.floor(Math.random() * this.session.memoried.length)
      ];
    this.resultName =
      this.pools.find((e) => {
        e.value === this.result;
      })?.label || '';

    console.log('答案是：', this.result);
  }
}
