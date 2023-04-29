import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemService } from './core/system.service';
import { DataService } from './core/data.service';
import { TextDirective } from './pugins/text.directive';
import { TimerPipe } from './pugins/timer.pipe';
import { MenuComponent } from './page/menu/menu.component';
import { HeaderComponent } from './page/header/header.component';
import { RandomTodayComponent } from './page/random-today/random-today.component';
import { ResinMemoComponent } from './page/resin-memo/resin-memo.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    RandomTodayComponent,
    ResinMemoComponent,
    TextDirective,
    TimerPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [SystemService, DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
