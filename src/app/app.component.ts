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
  constructor(private data: DataService, private router: Router) {}

  ngOnInit(): void {
    this.data.loadStorage();

    if (
      this.data.getValue(Constants.STORAGE_VERSION_KEY) !==
      environment.storageVerison
    ) {
      this.data.clearStorage();
      this.data.saveValue(
        Constants.STORAGE_VERSION_KEY,
        environment.storageVerison
      );
      this.data.saveStorage();
    }

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
