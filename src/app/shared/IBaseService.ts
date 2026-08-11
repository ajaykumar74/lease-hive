import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public C_APP_URL: string = environment.vlootApiUrl + '/Api';


  private jwtTokenSubject: BehaviorSubject<string> | undefined;
  private isTokenUpdatedSubject = new Subject<any>();

  private _timeZoneId: string = 'UTC';
  get timeZoneId(): string {
    return this._timeZoneId;
  }
  set timeZoneId(value: string | null | undefined) {
    this._timeZoneId = value?.trim() || 'UTC';
  }

  constructor(private http: HttpClient,
    // private jwtHelper: JwtHelperService
  ) {
    this.initializeProperties();
  }


  // Initialize properties
  private initializeProperties(): void {
    const initialToken = localStorage.getItem('jwt') || '';
    this.jwtTokenSubject = new BehaviorSubject<string>(initialToken);
    // Add initialization for other properties here
  }

  // Method to update JWT token value
  public updateJwtToken(token: string): void {
    this.jwtTokenSubject?.next(token);
    this.isTokenUpdatedSubject.next(null);
    localStorage.setItem('jwt', token); // Update token in local storage
  }



  isTokenUpdated(): Observable<any> {
    return this.isTokenUpdatedSubject.asObservable()
  }

  // Method to get the current JWT token
  public getJwtToken(): string {
    return this.jwtTokenSubject ? this.jwtTokenSubject.value : '';
  }

  // Reset/reinitialize all properties
  public resetProperties(): void {
    this.initializeProperties();
  }

  fetchAsPromise(url) {
    const headers = this.getHeaders();
    return this.http
      .get(url, { headers })
      .toPromise();
  }


  public getHeaders() {
    const token = localStorage.getItem("jwt");
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Timezone': this.timeZoneId || 'UTC'
    });


  }




  public handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';

    if (environment.envName == 'dev') {
      console.error(err);
    }


    if (err.status == 422) {
      errorMessage = `${err.error.Message} : \n`;
      err.error.Errors.forEach(msg => {
        errorMessage = errorMessage + msg + '\n';
      });
    }
    else if (err.status == 429) {
      errorMessage = `${err.error.message}`;
    }
    else if (err.status == 409) {
      errorMessage = `${err.error.ErrorMessage}`;
    }
    else if (err.status == 500) {
      errorMessage = `${err.error.ErrorMessage}`;
    }
    else if (err.status == 404) {
      errorMessage = `${err.error.Message} : \n`;
      err.error.Errors.forEach(msg => {
        errorMessage = errorMessage + msg + '\n';
      });
    }
    else if (err.status == 401) {
      //Token is expired, need to refresh token
      errorMessage = "Unauthorised request or session timed out!"
    }
    else if (err.status == 403) {
      errorMessage = `You may not have required permission/role to complete this action. Please contact admin.`;

    }
    else if (err.status == 400) {
      if (err.error.Errors) {
        errorMessage = `${err.error}`;
        errorMessage = `${err.error.Message} : \n`;
        err.error.Errors.forEach(msg => {
          errorMessage = errorMessage + msg + '\n';
        });

      }
      else if (err.error.Message != undefined || err.error.Message != null) {
        errorMessage = `${err.error.Message}`;
      }
      else {
        errorMessage = `${err.error}`;
      }
    }
    else {
      errorMessage = `Action failed due to server error.`;
    }
    return throwError(errorMessage);
  }


  onTapData(res: any) {
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    // Try refreshing tokens using refresh token
    const refreshToken: string = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      return false;
    }

    const credentials = JSON.stringify({ AccessToken: token, RefreshToken: refreshToken });
    let isRefreshSuccess: boolean = false;

    try {
      const response = await this.http.post(this.C_APP_URL + 'Account/refresh', credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        }),
        observe: 'response'
      }).toPromise()
        .then((data: any) => {
          const newToken = data.body.AccessToken;
          const newRefreshToken = data.body.RefreshToken;
          localStorage.setItem("jwt", newToken);
          localStorage.setItem("refreshToken", newRefreshToken);
          isRefreshSuccess = true;
        })
        .catch((error) => {
          isRefreshSuccess = false;
          // console.error(error);        
        });
      // If token refresh is successful, set new tokens in local storage. 
      return isRefreshSuccess;

    }
    catch (ex) {
      isRefreshSuccess = false;
    }

    return isRefreshSuccess;
  }

}
