import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // The refresh call must not try to refresh itself after an invalid or expired refresh token.
    if (req.url.toLowerCase().includes('/api/account/refresh')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();    
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe( 
      catchError((error: HttpErrorResponse) => {
        
        if (error.status === 401) {
          return this.handle401Error(authReq, next);
        } else {
          return throwError(() => error);
        }
         
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((tokens: any) => {
          const accessToken = tokens?.accessToken ?? tokens?.AccessToken;
          if (!accessToken) {
            throw new Error('The token refresh response did not contain an access token.');
          }
          this.isRefreshing = false;
          this.refreshTokenSubject.next(accessToken);

          return next.handle(
            request.clone({
              setHeaders: { Authorization: `Bearer ${accessToken}` }
            })
          );
        }),
        catchError(err => {
          this.isRefreshing = false;
          this.authService.logout();
          this.router.navigate(['/login']);
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(
            request.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            })
          );
        })
      );
    }
  }
}
