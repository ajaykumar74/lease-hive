import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BaseService } from './IBaseService';
import { BehaviorSubject, Observable, Subject, map, throwError } from 'rxjs';

import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { loggedInUser } from './IloggedInUser';
import { IBrandPartner } from '@/views/brandPartner/brandPartner';
import { ISelectItem } from './ISelectItem';

@Injectable({
  providedIn: 'root',
})


export class LoggedInUserService {

  private loggedInUserSubject: BehaviorSubject<loggedInUser>;
  public loggedInUserEvent$: Observable<loggedInUser>;
  private datePipe: DatePipe = new DatePipe('en-US');
  // private _brandPartner : IBrandPartner ;
  constructor(
    private http: HttpClient,
    private baseService: BaseService
  ) {
    this.initializeProperties();
    this.baseService.isTokenUpdated().subscribe(token => {
    });
  }

  public get loggedInUser(): loggedInUser {
    return this.loggedInUserSubject.value;
  }

  public get IsGlobalAdmin(): boolean {
    return this.loggedInUser.Username.toLowerCase().includes("@fleethive.ai") && this.loggedInUser.Role.toLowerCase().includes("partnerowner");

  }
  
  public get IsBrandPartner(): boolean {
    return this.loggedInUser.Role.toLowerCase().includes("partnerowner");
  }
  
  public get getRecordId(): number {
    if (this.loggedInUser.AccountType == 'Customer') {
      return this.loggedInUser.Customer.Id;
    }
    else {
      return this.loggedInUser.BrandPartner.Id;
    }

  }
  public get getRecordType(): string {
    return this.loggedInUser.AccountType;

  }

  /* 
    get brandPartner(): IBrandPartner {
      return this._brandPartner;
    }
  
    set brandPartner(obj: IBrandPartner) {
      this._brandPartner = obj;
    } */


  /* get serviceOperator(): IServiceOperator {
    return this._serviceOperator;
  }

  set serviceOperator(obj: IServiceOperator) {
    this._serviceOperator = obj;
  } */
  private subject = new Subject<any>();
  getMessage(): Observable<any> {
    return this.loggedInUserSubject.asObservable();
  }

  // Initialize properties
  private initializeProperties(): void {
    const storedUser = localStorage.getItem('loggedInUser');
    const user = storedUser ? JSON.parse(storedUser) : null;
    this.loggedInUserSubject = new BehaviorSubject<loggedInUser>(
      user
    );
    this.baseService.timeZoneId = user?.BrandPartner?.TimeZone;

    this.loggedInUserEvent$ = this.loggedInUserSubject.asObservable();
  }


  public updateloggedInUser(user: loggedInUser): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    this.baseService.timeZoneId = user.BrandPartner?.TimeZone;
    this.loggedInUserSubject.next(user);
    user.Name = user.Username.split('@')[0];
  }


  public logout(): void {
    this.loggedInUserSubject.next(null);
    this.baseService.updateJwtToken('');
    localStorage.removeItem('loggedInUser'); // Clear stored user
    localStorage.removeItem('jwt'); // Clear token from local storage
    localStorage.removeItem('refreshToken');
    this.baseService.resetProperties(); // Reset all properties in BaseService

  }


  get headers(): HttpHeaders {
    return this.baseService.getHeaders();
  }

  getPartyOptions(selectedId?: number): Observable<ISelectItem[]> {
    const tenant = this.loggedInUser?.Tenant;
    const tenantId = tenant?.Id ?? tenant?.TenantId;

    if (!tenantId) {
      return throwError(() => 'Tenant information is not available for the logged-in user.');
    }

    const selectedIdQuery = selectedId && selectedId > 0
      ? `&selectedId=${selectedId}`
      : '';
    const url = `${this.baseService.C_APP_URL}/Lookups/parties?tenantId=${tenantId}&pageSize=100${selectedIdQuery}`;

    return this.http.get<any>(url, { headers: this.headers }).pipe(
      map(response => (response.data || []).map(item => ({
        Id: item.Id,
        Value: item.Id,
        Text: item.DisplayText
      })))
    );
  }


  invalidateCache(cacheData: CacheData) {
    if (cacheData == CacheData.VehicleCategory) {

    }
    else if (cacheData == CacheData.Customer) {

    }
  }

  fetchAsPromise(url) {
    const headers = this.baseService.getHeaders();
    return this.http
      .get(url, { headers })
      .toPromise();
  }

  //"yyyy-MM-dd
  formatDate(date): String {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  convertTZ(date, tzString) {
    var retDate;
    if (typeof date === "string") {
      var dt = new Date(date);
      retDate = new Date(dt.toLocaleString("en-US", { timeZone: tzString }));
    }
    else {
      retDate = new Date(date.toLocaleString("en-US", { timeZone: tzString }));
    }
    return retDate;
  }

  getJsonDate(date: any) {
    var retDate;
    var tzString = 'Asia/Kolkata';
    if (environment.envName == 'prod' || environment.envName == 'qa') {
      tzString = 'America/Los_Angeles';
    }

    if (date == null) {
      date = new Date(-8640000000000000);
    }

    if (typeof date === "string") {
      var dt = new Date(date);
      retDate = new Date(dt.toLocaleString("en-US", { timeZone: tzString }));
    }
    else {
      retDate = new Date(date.toLocaleString("en-US", { timeZone: tzString }));
    }

    var d = new Date(); // for now 
    retDate.setHours(d.getUTCHours());
    retDate.setMinutes(d.getUTCMinutes());
    retDate.setSeconds(d.getUTCSeconds());
    let formattedDate = this.datePipe.transform(retDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';

    return formattedDate;
  }

  getJsonDateWithTime(datepart: Date, timepart: Date) {
    var retDate;
    var tzString = 'Asia/Kolkata';
    if (environment.envName == 'prod' || environment.envName == 'qa') {
      tzString = 'America/Los_Angeles';
    }

    retDate = new Date(datepart.toLocaleString("en-US", { timeZone: tzString }));
    retDate.setHours(timepart.getUTCHours());
    retDate.setMinutes(timepart.getUTCMinutes());
    retDate.setSeconds(timepart.getUTCSeconds());
    let formattedDate = this.datePipe.transform(retDate, 'yyyy-MM-ddTHH:mm:ss') + 'Z';
    return formattedDate;
  }



  // convertJsonDateToDate(date): any {
  //   if (date == null) {
  //     date = new Date(-8640000000000000);
  //   }
  //   if (typeof date === "string") {
  //     var dt = new Date(date);
  //     if (dt.getFullYear() == 1) {
  //       return null;
  //     }
  //     else {
  //       return dt;
  //     }
  //   }
  // }


  generateReadableTransactionId(): string {
    const datePart = this.getTodayDate(); // e.g., 20250531
    const randomPart = this.getRandomCode(6); // e.g., AB123C
    return `TXN-${datePart}-${randomPart}`;
  }

  getTodayDate(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }

  getRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export enum Operator {
  EqualTo,
  NotEqualTo,
  NotEqualToNullable,
  EqualToNullable,
  Contains,
  EndsWith,
  StartWith,
  GreaterThan,
  LessThan,
  GreaterThanEqualTo,
  LessThanEqualTo,
  Between,
  Range
}

export enum CombineCriteriaType {
  None,
  CombineOR,
  CombineAnd,
  CombineORExact,
  CombineAndExact
}


export enum DataType {
  Text,
  TextExact,
  Amount,
  Int,
  Date,
  bit
}


export enum CacheData {
  Labours,
  Agents,
  PickList,
  Carrier,
  Chamber,
  Customer,
  Driver,
  Supplier,
  Item,
  InvItem,
  VehicleCategory
}



export interface IStateData {
  Id: number;
  Name: string;
  Data: any;
  RecordType: string;
}



