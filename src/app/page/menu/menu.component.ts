import { Component } from '@angular/core';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';

/**
 * 工具菜单  页面模块
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  /**
   * 菜单页面的储存数据
   */
  session: { lastPage?: string } = this.data.getValue(Constants.MENU_KEY, {});

  /**
   * 链接一览
   */
  links = [
    { route: 'today', text: 'MENU.link_00' },
    { route: 'test', text: 'MENU.link_01' },
  ];

  /**
   * 构造器
   *
   * @param data 数据管理服务
   */
  constructor(private data: DataService) {}

  /**
   * 当用户使用某个功能的时候将其选择储存到本地数据中
   *
   * @param key 当前被选择路由
   */
  save(key: string): void {
    this.session.lastPage = key;
    this.data.saveValue(Constants.MENU_KEY, this.session);
  }
}
