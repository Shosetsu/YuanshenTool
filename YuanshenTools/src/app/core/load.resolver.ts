import { Component, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Pre-process
 */
@Injectable({ providedIn: 'root' })
export class LoadResolver implements Resolve<Component> {
  constructor() {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return of(true);
  }
}
