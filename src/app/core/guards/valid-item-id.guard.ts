import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// Guard sprawdza format parametru, nie istnienie produktu ani uprawnienia.
// UrlTree zwraca decyzję o przekierowaniu routerowi zamiast wywoływać navigate w guardzie.
export const validItemIdGuard: CanActivateFn = (route) => {
  const id = Number(route.paramMap.get('id'));
  return Number.isSafeInteger(id) && id > 0 ? true : inject(Router).createUrlTree(['/items']);
};
