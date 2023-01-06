import { Component, OnInit } from '@angular/core';
import {
  ActivationEnd,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { SystemService } from './core/system.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /** 加载指示符 */
  isLoader = false;

  /**
   * 构造器
   *
   * @param router 路由管理服务
   * @param system 系统服务
   */
  constructor(private router: Router, private system: SystemService) {}

  /**
   * 程序初始处理
   */
  ngOnInit(): void {
    // 预先绑定路由事件
    this.router.events.subscribe((event) => {
      switch (true) {
        // 开始导航时添加屏幕锁定
        case event instanceof NavigationStart: {
          this.isLoader = true;
          document.body.classList.add('load');
          break;
        }
        // 结束导航时解除屏幕锁定
        case event instanceof NavigationEnd: {
          this.isLoader = false;
          document.body.classList.remove('load');
          break;
        }
        // 当路由完成时读取路由数据并更新标题
        case event instanceof ActivationEnd: {
          const title = (event as ActivationEnd).snapshot.data['title'];
          document.title =
            this.system.langText['MAIN_TITLE'] +
            (title ? '｜' + this.system.langText[title] : '');
          break;
        }
      }
    });
  }
}
