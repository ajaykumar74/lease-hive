
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from '@/layout/service/layout.service';
import { AccountService } from './account-service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-reset-password',
  providers: [MessageService],
  standalone: false,
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  rememberMe: boolean = false;
  LayoutService = inject(LayoutService);
  isDarkTheme = computed(() => this.LayoutService.isDarkTheme());
  btnCaption = '';
  isSuccess: boolean = false;
  submitted: boolean = false;
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,}$/;

  infoMsg: string = '';
  ConfirmPassword: string = '';
  NewPassword: string = '';
  email = '';
  token = '';
  loginData = {
    ConfirmPassword: '',
    NewPassword: ''
  };

  constructor(public router: Router,
    private accountService: AccountService,
    private activatedRouter: ActivatedRoute,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.activatedRouter.queryParamMap.subscribe(params => {
      // Activation links are generated with lowercase parameter names. Accept the
      // PascalCase variants as well so links from older templates still work.
      this.email = (params.get('email') ?? params.get('Email') ?? '').trim();
      this.token = (params.get('token') ?? params.get('Token') ?? '').trim();
    });
  }

  ResetPassword(): void {
    if (!this.email || !this.token) {
      this.messageService.add({
        severity: 'error',
        detail: 'This password reset link is incomplete. Please open the invitation link again or request a new invitation.',
      });
      return;
    }

    if (!this.loginData.NewPassword || !this.loginData.ConfirmPassword) {
      this.messageService.add({ severity: 'error', summary: '', detail: 'Enter and confirm your new password.' });
      return;
    }

    if (this.loginData.NewPassword !== this.loginData.ConfirmPassword) {
      this.messageService.add({
        severity: 'error',
        detail: 'Passwords do not match. Please confirm your new password.',
      });
      return;
    }

    if (!this.passwordPattern.test(this.loginData.NewPassword)) {
      this.messageService.add({
        severity: 'error',
        detail:
          'Password must be 7–12 characters and include an uppercase, lowercase, number, and special character.',
      });
      return;
    }

    const resetRequest = {
      Email: this.email,
      Token: this.token,
      NewPassword: this.loginData.NewPassword,
    };

    this.submitted = true;
    this.btnCaption = 'Please wait...';
    this.accountService.resetPassword(resetRequest).subscribe({
      next: data => {
        this.isSuccess = true;
        //this.router.navigate(["/auth/login"]);
      },
      error: err => {
        this.isSuccess = false;
        this.submitted = false;
        this.btnCaption = 'Reset Password';
       
        let errMsg = err || 'An error occurred'
        this.messageService.add({
          severity: 'error',
          detail: errMsg,
        });

      },
      complete: () => { this.submitted = false; this.btnCaption = 'Reset Password'; }
    });
  }

  login(): void {
    this.router.navigate(["/auth/login"]);
  }


}

