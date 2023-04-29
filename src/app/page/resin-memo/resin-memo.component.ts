import { Component, OnDestroy, inject } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { SystemService } from 'src/app/core/system.service';
import { ResinMemo, ResinMemoData } from 'src/app/interface/resin-memo.storage';
import { TimerPipe } from 'src/app/pugins/timer.pipe';

@Component({
  selector: 'app-resin-memo',
  templateUrl: './resin-memo.component.html',
  styleUrls: ['./resin-memo.component.scss'],
})
export class ResinMemoComponent implements OnDestroy {
  /** 用户数据 */
  session = this.data.getValue<ResinMemoData>(Constants.RESIN_MEMO_KEY, {
    logs: {},
  });

  isNewProcess = false;

  temp = { name: '', time: '', lost: [] as { now: number; diff: number }[] };

  memoTime: Record<string, Subject<number>> = {};

  private timerFn: ((date: number) => void)[] = [];
  private unSubscribeFn: (() => void)[] = [];

  /** 文本管理 */
  text = inject(SystemService).langText;
  /** keyvalue默认顺序 */
  orginalOrder = () => 0;

  /**
   * 构造器
   *
   * @param data 数据管理服务
   */
  constructor(private data: DataService) {
    const sub = interval(1000).subscribe(() => {
      const date = Date.now();
      this.timerFn.forEach((fn) => fn(date));
    });
    this.unSubscribeFn.push(() => sub.unsubscribe());

    Object.keys(this.session.logs).forEach((key) =>
      this.addResinTimer(key, this.session.logs[key])
    );
  }

  addBlock(): void {
    const time = this.temp.time.split(':');

    this.session.logs[this.temp.name] = {
      status: 'info',
      endTime:
        Date.now() +
        (Number(time[0]) * 3600 + Number(time[1]) * 60 + Number(time[2])) *
          1000,
      lostTime: this.temp.lost,
    };
    this.addResinTimer(this.temp.name, this.session.logs[this.temp.name]);
    this.save();
    this.resetInput();
  }

  resetInput(): void {
    this.temp = { name: '', time: '', lost: [] };
    this.isNewProcess = false;
  }

  private addResinTimer(name: string, memo: ResinMemo): void {
    this.memoTime[name] = new Subject();
    this.timerFn.push((date) => this.memoTime[name].next(memo.endTime - date));
  }

  getResin(memo: ResinMemo): number {
    return 160 - Math.max(Math.ceil((memo.endTime - Date.now()) / 480000), 0);
  }

  toDate(date: number): string {
    return new Date(date).toLocaleDateString();
  }
  getResinByDiff(diff: number): number {
    return Math.floor(diff / 480000);
  }
  getSumLostResin(memo: ResinMemo): number {
    return this.getResinByDiff(
      memo.lostTime.reduce((lost, curLost) => lost + curLost.diff, 0)
    );
  }

  minusResin(memo: ResinMemo, count: number): void {
    const now = Date.now();
    let tempEnd = memo.endTime;

    if (memo.endTime < now) {
      memo.lostTime.push({ now, diff: now - memo.endTime });
      tempEnd = now + 480000;
    }
    memo.endTime = tempEnd + count * 480000;
    this.save();
  }

  modify(key: string): void {
    this.isNewProcess = false;
    const memo = this.session.logs[key];
    memo.status = 'edit';
    this.temp.name = key;
    this.temp.time = new TimerPipe().transform(
      memo.endTime - Date.now(),
      false
    );
    this.temp.lost = memo.lostTime;
  }

  remove(key: string): void {
    delete this.session.logs[key];
    this.save();
  }

  /**
   * 保存所有数据到本地
   */
  save(): void {
    this.data.saveValue<ResinMemoData>(Constants.RESIN_MEMO_KEY, this.session);
  }

  ngOnDestroy(): void {
    this.unSubscribeFn.forEach((fn) => fn());
  }
}
