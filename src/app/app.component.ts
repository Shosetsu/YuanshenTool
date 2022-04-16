import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Constants } from './constants/cosntants';
import { DataService } from './core/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /**
   * 构造器
   *
   * @param data 数据管理服务
   * @param router 路由管理服务
   */
  constructor(private data: DataService, private router: Router) {}

  /**
   * 程序初始处理
   */
  ngOnInit(): void {
    // 加载本地储存数据
    this.data.loadStorage();

    // 检查储存数据版本是否一致
    if (
      this.data.getValue(Constants.STORAGE_VERSION_KEY) !==
      environment.storageVerison
    ) {
      // 初始化储存数据
      this.data.clearStorage();
      this.data.saveValue(
        Constants.STORAGE_VERSION_KEY,
        environment.storageVerison
      );
      this.data.saveStorage();
    }

    // 当路由完成时读取路由数据并更新标题
    this.router.events
      .pipe(
        filter(
          (event): event is ActivationEnd => event instanceof ActivationEnd
        )
      )
      .subscribe((event) => {
        const title = event.snapshot.data['title'];
        document.title = '原神工具集' + (title ? '｜' + title : '');
      });
  }
}
