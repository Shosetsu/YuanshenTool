import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loadInitial } from './core/pre-processor';
import { MenuComponent } from './page/menu/menu.component';
import { RandomTodayComponent } from './page/random-today/random-today.component';
import { preloaderPools } from './page/random-today/random-today.preloader';

const routes: Routes = [
  {
    path: 'today',
    resolve: { pools: preloaderPools },
    canActivate: [loadInitial],
    component: RandomTodayComponent,
    data: { title: 'REOLL_TODAY_TITLE' },
  },
  {
    path: '',
    canActivate: [loadInitial],
    component: MenuComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
