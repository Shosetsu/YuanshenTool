import { Component, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * 预处理模块
 */
@Injectable({ providedIn: 'root' })
export class LoadResolver implements Resolve<Component> {
  constructor() {}

  /**
   * 预处理
   *
   * @param route
   * @param state
   * @returns
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    // 诶嘿，我现在什么也没做
    return of(true);
  }
}
