import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Constants } from 'src/app/constants/cosntants';
import { DataService } from 'src/app/core/data.service';
import { SystemData } from 'src/app/interface/system.storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  layers: { name: string; url: string; order: number }[] = [];

  currentLanguage = '';

  constructor(private router: Router, private data: DataService) {}

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
        const order = event.snapshot.data['order'] ?? 0;
        const names = event.snapshot.title?.split('｜') ?? [];

        this.layers = [
          ...this.layers.filter((layer) => layer.order < order),
          {
            name: names[1] ?? names[0],
            url: event.snapshot.url[0]?.path ?? '',
            order: order,
          },
        ];
      });
  }

  changeLanguage() {
    const systemData = this.data.getValue<SystemData>(Constants.SYSTEM_KEY, {});
    systemData.language = this.currentLanguage;
    this.data.saveValue(Constants.SYSTEM_KEY, systemData);
    location.reload();
  }
}
