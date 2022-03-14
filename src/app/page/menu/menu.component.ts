import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';

/**
 * 菜单
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  session: { lastPage: string } = this.data.getValue(Constants.MENU_KEY) || {};

  links = [
    { route: 'today', text: '工具1：今天树脂刷什么' },
    { route: 'test', text: '工具2：咕咕咕，待定…' },
  ];

  constructor(private data: DataService) {}

  save(key: string): void {
    this.session.lastPage = key;
    this.data.saveValue(Constants.MENU_KEY, this.session);
  }
}
