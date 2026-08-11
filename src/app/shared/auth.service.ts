import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BaseService } from './IBaseService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);
 private baseUrl :  string ;
  constructor(private http: HttpClient, private baseService: BaseService,) {
     this.baseUrl = this.baseService.C_APP_URL + '/Account';
  }

  getToken(): string | null {
    return localStorage.getItem('jwt'); // access token
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string) { 
       localStorage.setItem("jwt", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
  }

  refreshToken(): Observable<any> {   
    return this.http.post(`${this.baseUrl}/refresh`, {
    AccessToken: this.getRefreshToken(),  RefreshToken: this.getRefreshToken()
    }).pipe(
      tap((tokens: any) => {
        this.setTokens(tokens.accessToken, tokens.refreshToken);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('refreshToken');
  }
}
