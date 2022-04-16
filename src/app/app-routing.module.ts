import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './page/menu/menu.component';
import { RandomTodayComponent } from './page/random-today/random-today.component';

const routes: Routes = [
  {
    path: 'today',
    component: RandomTodayComponent,
    data: { title: '今天刷什么' },
  },
  {
    path: '',
    // resolve: { data: LoadResolver },
    component: MenuComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
