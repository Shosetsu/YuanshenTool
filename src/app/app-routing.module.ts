import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadInitial } from './core/load.initial';
import { MenuComponent } from './page/menu/menu.component';
import { RandomTodayComponent } from './page/random-today/random-today.component';
import { RandomTodayPreloader } from './page/random-today/random-today.preloader';

const routes: Routes = [
  {
    path: 'today',
    resolve: { data: RandomTodayPreloader },
    canActivate: [LoadInitial],
    component: RandomTodayComponent,
    data: { title: 'REOLL_TODAY_TITLE' },
  },
  {
    path: '',
    canActivate: [LoadInitial],
    component: MenuComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
