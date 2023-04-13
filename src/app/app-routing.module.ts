import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadInitial } from './core/pre-processor';
import { MenuComponent } from './page/menu/menu.component';
import { RandomTodayComponent } from './page/random-today/random-today.component';
import { preloaderPools } from './page/random-today/random-today.preloader';
import { getTitle } from './util/util';

const routes: Routes = [
  {
    path: 'today',
    title: () => getTitle('REOLL_TODAY_TITLE'),
    resolve: { pools: preloaderPools },
    canActivate: [loadInitial],
    data: { order: 1 },
    component: RandomTodayComponent,
  },
  {
    path: '',
    title: () => getTitle(),
    canActivate: [loadInitial],
    data: { order: 0 },
    component: MenuComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
