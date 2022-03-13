import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from './constants/cosntants';
import { DataService } from './core/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private data: DataService) {}
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
  }
}
