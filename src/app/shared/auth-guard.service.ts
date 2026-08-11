import { Injectable } from '@angular/core';
import {
  CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { BaseService } from './IBaseService';
import { LoggedInUserService } from './LoggedInUserService';
 

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  private baseUrl :  string ;

  constructor(private jwtHelper: JwtHelperService,
    private router: Router,
    private http: HttpClient,
    private baseService: BaseService,
    private loggedInUserService: LoggedInUserService) {
      this.baseUrl = this.baseService.C_APP_URL + '/Account';
  }


  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) { 
    var token = localStorage.getItem("jwt");

    if (this.loggedInUserService.loggedInUser === undefined || this.loggedInUserService.loggedInUser == null) {
      this.router.navigate(["/auth/login"], { queryParams: { returnUrl: state.url } });
      return false;
    } 
        

     if (this.jwtHelper.isTokenExpired(token)) { 
     var isSuccess = await this.tryRefreshingTokens(token);
     if (!isSuccess) {
      this.router.navigate(["/auth/login"], { queryParams: { returnUrl: state.url } });
     }
     return true;
    }

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;      
    }     
    return false;
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    // Try refreshing tokens using refresh token
    const refreshToken: string = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      return false;
    } 
    const credentials = JSON.stringify({ AccessToken: token, RefreshToken: refreshToken });
    let isRefreshSuccess: boolean =false;

    try {
      const response = await this.http.post(this.baseUrl + '/refresh', credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        observe: 'response'
      }).toPromise()
        .then((data: any) => {
        
          const newToken = data.body.AccessToken;
          const newRefreshToken =data.body.RefreshToken; 
           // If token refresh is successful, set new tokens in local storage.  
            localStorage.setItem("jwt", newToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            isRefreshSuccess = true;  
        })
        .catch((error) => {
          isRefreshSuccess = false;
         // console.error(error);        
        });
     
    }
    catch (ex) {
      isRefreshSuccess = false;
    }
   
      return  isRefreshSuccess ;
  }

}
