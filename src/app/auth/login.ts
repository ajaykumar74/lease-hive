import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { AccountService } from './account-service';

import { BaseService } from '../shared/IBaseService';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { loggedInUser } from '@/shared/IloggedInUser';
import { MessageService } from 'primeng/api';
import { PortalUserService } from '@/views/portalUser/portalUser.service';
import { environment } from '../../environments/environment';
import { AppConstants } from '@/shared/constants/AppConstants';
import { ExternalAuthProvider } from './ExternalAuthProvider';

declare const google: any;
@Component({
  selector: 'app-login',
  standalone: false,
  providers: [MessageService],
  templateUrl: 'login.html',
  styleUrls: [
    './login.css',
  ],

})
export class Login {
  rememberMe: boolean = false;
  LayoutService = inject(LayoutService);
  isDarkTheme = computed(() => this.LayoutService.isDarkTheme());


  loginData = {
    Username: '',
    Password: '',
    RememberMe: false,
  };

  btnCaption: string = 'Sign in';
  submitted: boolean;
  invalidLogin: boolean;
  returnUrl: any;
  externalAuthProviders: ExternalAuthProvider[] = [];

  constructor(public router: Router,
    private accountService: AccountService,
    private loggedInUserService: LoggedInUserService,
    private portalUserService: PortalUserService,
    private baseService: BaseService,
    private messageService: MessageService,
    private http: HttpClient,
    private AppConst: AppConstants,

  ) { }

  ngOnInit() {
    this.returnUrl = "/dashboard";
    if (environment.envName == 'dev') {
      this.loginData.Password = 'Pass@1234',
        this.loginData.Username = 'admin@fleethive.in'
    }
  }

  ngAfterViewInit(): void {
    localStorage.setItem("AuthAction", this.AppConst.AuthAction.None);
    this.loadExternalAuthProviders();
    //this.pingWorker();
    setTimeout(() => {
    }, 500);
  }

  private loadExternalAuthProviders() {
    this.accountService.loadExternalAuthProviders().subscribe(providers => {
      this.externalAuthProviders = providers;
      this.initializeProviders(providers);
    });
  }

  private initializeProviders(providers: ExternalAuthProvider[]) {
    providers.forEach(p => {
      switch (p.provider) {
        case 'Google':
          this.initGoogle(p.clientId);
          break;
      }
    });
  }

  _googleClientId: string = '';
  private initGoogle(clientId: string) {
    this._googleClientId = clientId;
  }
  private pingWorker(): void {
    fetch("https://taskworker.vloot.in/jobs", {
      method: "GET",
      mode: "no-cors",
      keepalive: true
    }).catch(() => { });
  }

  loginClicked() {
    this.messageService.clear();
    if (this.loginData.Username == '' || this.loginData.Password == '') {
      this.messageService.add({ severity: 'error', summary: '', detail: 'Please enter valid Username and password.' });
      return;
    }

    this.submitted = true;
    this.btnCaption = 'Please wait...';

    this.accountService.login(this.loginData).subscribe(
      response => {
        if (response == null || response.Success == false) {
          this.submitted = false;
          this.invalidLogin = true;
          this.btnCaption = 'Login';
          this.messageService.add({ severity: 'error', summary: '', detail: response.Message });
        }
        else {
          var user = {} as loggedInUser;
          user.UserId = response.UserId;
          user.Username = response.Username;
          user.RecordId = response.RecordId;
          user.Role = response.Role;
          this.baseService.updateJwtToken(response.Token);
          localStorage.setItem("jwt", response.Token);
          localStorage.setItem("refreshToken", response.RefreshToken);
          this.getCustomerAndPartner(user);

        }

      }, err => {
        //alert('Access Denied!. Incorrect username or password.');   
        this.submitted = false;
        this.invalidLogin = true;
        this.btnCaption = 'Login';
        if (err === 'Action failed due to server error.') {
          this.messageService.add({ severity: 'error', summary: '', detail: 'Action failed due to server error.' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: '', detail: 'Access Denied!. Incorrect username or password.' });
        }
      }

    );

  }

  getCustomerAndPartner(user: loggedInUser) {
    this.portalUserService.getCustomerAndPartner(user.RecordId).subscribe({
      next: res => {
        const data = res.data;
        if (data != null && data.BrandPartner != null) {
          user.AccountType = data.AccountType;
          user.Customer = data.Customer;
          user.BrandPartner = data.BrandPartner;
          user.Tenant = data.Tenant;
          
          this.loggedInUserService.updateloggedInUser(user);
          this.loggedInUserService.loadPicklistCache().subscribe({
            next: () => this.router.navigate(['dashboard/']),
            error: err => {
              this.submitted = false;
              this.btnCaption = 'Login';
              this.messageService.add({ severity: 'error', summary: '', detail: err });
            }
          });
         /*  if (this.loggedInUserService.loggedInUser.AccountType == 'Customer') {
            this.router.navigate(['dashboard/']);
          }
          else {
            this.router.navigate(['/dashboard/admin/']);
          } */


        }
        else {
          this.submitted = false;
          this.invalidLogin = true;
          this.btnCaption = 'Login';
          this.messageService.add({ severity: 'error', summary: '', detail: 'User not linked with active customer/partner.' });
        }
      },
      error: err => { },
      complete: () => { }
    });
  }

  onRegister() {
    this.router.navigate(['onboarding/new']);
  }

  onResume() {
    this.router.navigate(['/onboarding/resume']);
  }
  forgotClicked() {
    this.router.navigate(['auth/forgot']);
  }

  googleInitialized = false;

  loginWithGoogle() {
    localStorage.setItem("AuthAction", this.AppConst.AuthAction.Login);
    const client = google.accounts.oauth2.initCodeClient({
      client_id: this._googleClientId,
      scope: 'openid email profile',
      redirect_uri: `${environment.MyUrl}auth/login-success`,
      ux_mode: 'redirect',
    });

    client.requestCode();
  }




  displayerror(error: HttpErrorResponse): Observable<any> {
    // we expect 404, it's not a failure for us.
    if (error.status === 0) {
      alert('Server is not reachable. please check environemnt settings.');
    }
    else if (error.error.Errors != null) {
      var errorMessage = `${error.error.Message} : \n`;
      error.error.Errors.forEach(msg => {
        errorMessage = errorMessage + msg + '\n';
      });
      alert(errorMessage);
    }
    else {
      alert(error.error.Message);
    }
    // other errors we don't know how to handle and throw them further.
    return throwError(() => error);
  }



  forgot(): void {
    this.router.navigate(["/forgot"]);
  }


}
