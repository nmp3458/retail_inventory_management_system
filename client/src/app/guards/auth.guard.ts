import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser().pipe(
    map(() => true),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return of(router.createUrlTree(['/Login']));
      }
      return throwError(() => error);
    })
  );
};
