import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { SystemService } from 'src/app/core/system.service';
import { SystemData } from 'src/app/interface/system.storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  layers: TitlePoint[] = [];

  currentLanguage = '';

  constructor(
    private router: Router,
    private data: DataService,
    private system: SystemService
  ) {}

  ngOnInit(): void {
    this.currentLanguage =
      this.data.getValue<SystemData>(Constants.SYSTEM_KEY, {}).language ??
      'zh-cn';

    this.router.events
      .pipe(
        filter(
          (event): event is ActivationEnd => event instanceof ActivationEnd
        )
      )
      .subscribe((event) => {
        this.layers = this.getLayers(event);
      });
  }

  private getLayers(event: ActivationEnd): TitlePoint[] {
    const url = event.snapshot.url[0]?.path ?? '';
    const findTitle = (
      url: string,
      base: TitlePoint,
      tree: TitlePoint[]
    ): TitlePoint[] | undefined => {
      const nowLayers = [
        ...tree,
        {
          ...base,
          name: this.system.langText[base.name],
        },
      ];
      if (base.url === url) return nowLayers;
      let tested: TitlePoint[] | undefined;
      base.children?.some((tp) => (tested = findTitle(url, tp, nowLayers)));
      return tested;
    };
    return findTitle(url, titles, []) ?? [];
  }

  changeLanguage() {
    const systemData = this.data.getValue<SystemData>(Constants.SYSTEM_KEY, {});
    systemData.language = this.currentLanguage;
    this.data.saveValue(Constants.SYSTEM_KEY, systemData);
    location.reload();
  }
}

export type TitlePoint = {
  order: number;
  name: string;
  url: string;
  children?: TitlePoint[];
};
export const titles: TitlePoint = {
  order: 0,
  name: 'MAIN_TITLE',
  url: '',
  children: [
    { order: 1, name: 'REOLL_TODAY_TITLE', url: 'today' },
    { order: 1, name: 'RESIN_MEMO_TITLE', url: 'resin' },
  ],
};
