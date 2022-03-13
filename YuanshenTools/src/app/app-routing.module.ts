import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadResolver } from './core/load.resolver';
import { MenuComponent } from './page/menu/menu.component';
import { RandomTodayComponent } from './page/random-today/random-today.component';

const routes: Routes = [
  {
    path: 'today',
    component: RandomTodayComponent,
  },
  {
    path: '',
    // resolve: { data: LoadResolver },
    component: MenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
