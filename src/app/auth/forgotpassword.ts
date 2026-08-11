
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { AccountService } from './account-service';
import { environment } from '../../environments/environment';
import { BaseService } from '../shared/IBaseService';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import { loggedInUser } from '@/shared/IloggedInUser';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-forgot-password',
  providers: [MessageService],
  standalone: false,
  templateUrl: './forgotpassword.html',
})
export class ForgotPassword {
  rememberMe: boolean = false;
  LayoutService = inject(LayoutService);
  isDarkTheme = computed(() => this.LayoutService.isDarkTheme());
  btnCaption = '';
  isSuccess: boolean = false;
  submitted: boolean = false;
  infoMsg: string = '';
  loginData = {
    EmailId: '',
    Password: '',
    RememberMe: false,
  };

  constructor(public router: Router,
    private accountService: AccountService,
    private loggedInUserService: LoggedInUserService,
    private baseService: BaseService,
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    //this.pingWorker();
  }

  private pingWorker(): void {
    fetch("https://taskworker.vloot.in/jobs", {
      method: "GET",
      mode: "no-cors",
      keepalive: true
    }).catch(() => { });
  }

  ResetPassword(): void {
    var ResetpwdData = JSON.stringify({ Email: this.loginData.EmailId, DomainUrl: environment.MyUrl });
    if (this.loginData.EmailId == '') {
      this.messageService.add({ severity: 'error', summary: '', detail: 'Please enter valid EmailId .' });
      return;
    }
    this.submitted = true;
    this.btnCaption = 'Please wait...';
    this.accountService.forgotPassword(ResetpwdData).subscribe({
      next: data => {
        this.isSuccess = true;
        this.infoMsg = "A link to reset your password is sent to emailId associated with this account. Please check your inbox and click 'Password Reset' link to complete the process."
      },
      error: err => { this.messageService.add({ severity: 'error', summary: '', detail: err }); },
      complete: () => { this.submitted = false; this.btnCaption = 'Reset Password'; }
    });
  }

  login(): void {
    this.router.navigate(["/auth/login"]);
  }


}

