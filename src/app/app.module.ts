import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemService } from './core/system.service';
import { DataService } from './core/data.service';
import { MenuComponent } from './page/menu/menu.component';
import { RandomTodayComponent } from './page/random-today/random-today.component';
import { TextDirective } from './directive/text.directive';
import { HeaderComponent } from './page/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RandomTodayComponent,
    TextDirective,
    HeaderComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [SystemService, DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
