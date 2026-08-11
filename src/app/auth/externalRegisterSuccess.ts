
// import { Component, computed, inject } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { LayoutService } from '@/layout/service/layout.service';
// import { AccountService } from './account-service';
// import { environment } from '../../environments/environment';
// import { BaseService } from '../shared/IBaseService';
// import { catchError, Observable, tap, throwError } from 'rxjs';
// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { LoggedInUserService } from '@/shared/LoggedInUserService';
// import { loggedInUser } from '@/shared/IloggedInUser';
// import { MessageService } from 'primeng/api';
// import { AppConstants } from '@/shared/constants/AppConstants';
// import { PortalUserService } from '@/views/portalUser/portalUser.service';
// import { OnboardingService } from '../views/onboarding/onboarding.service';
// @Component({
//   selector: 'app-external-register-success',
//   providers: [MessageService],
//   standalone: false,
//   templateUrl: './externalRegisterSuccess.html',
// })
// export class ExternalRegisterSuccess {
//   rememberMe: boolean = false;
//   LayoutService = inject(LayoutService);
//   isDarkTheme = computed(() => this.LayoutService.isDarkTheme());
//   btnCaption = '';
//   isSuccess: boolean = false;
//   submitted: boolean = false;
//   invalidLogin: boolean = false;
//   infoMsg: string = '';
//   loginData = {
//     EmailId: '',
//     Password: '',
//     RememberMe: false,
//   };

//   constructor(public router: Router,
//     private accountService: AccountService,
//     private loggedInUserService: LoggedInUserService,
//     private baseService: BaseService,
//     private messageService: MessageService,
//     private activatedRouter: ActivatedRoute,
//     private AppConst: AppConstants,
//     private http: HttpClient,
//     private portalUserService: PortalUserService,
//     private readonly onboardingService: OnboardingService,

//   ) { }

//   ngOnInit() {
//     this.activatedRouter.queryParams.subscribe(params => {
//       var code = params['code'];
//       const thirdPartyLoginRequest = {
//         IdToken: code,
//         LoginProvider: this.AppConst.ThirdPartyLoginProvider.Google
//       };

//       this.onboardingService.registerWithGoogle(thirdPartyLoginRequest).subscribe(
//         response => {
//           if (response == null || response.Success == false) {
//             this.handleLoginFailure(response?.Message);
//           } else {
//            // this.onGoogleCredentialReceived(response);
//           }
//         },
//         err => this.handleLoginError(err)
//       );
//     });
//   }


//   // private onGoogleCredentialReceived(response: any) {
//   //   // Google returns ID token here  
//   //   const thirdPartyLoginRequest = {
//   //     IdToken: response.credential,
//   //     LoginProvider: this.AppConst.ThirdPartyLoginProvider.Google
//   //   };

//   //   this.onboardingService.registerWithGoogle(thirdPartyLoginRequest).subscribe({
//   //     next: data => {
//   //       data = data.data;
//   //       if (data === undefined || data == null || data.EmailId == null) {
//   //         //this.messageService.showError("The email " + this.registerObj.EmailId + " is not registered in our system. Please check for typos or sign up for an account.");
//   //         //  this.messageService.add({ severity: 'error', summary: '', detail });
//   //       }
//   //       else {
//   //         this.onboardingService.onboardingData = data;
//   //         this.router.navigate(['onboarding/subscribe']);
//   //       }
//   //     },
//   //     error: err => {
//   //       this.handleLoginError(err);
//   //     },
//   //     complete: () => {
//   //       //this.isLoading = false; this.isShowprogressbar = false;
//   //     }
//   //   });
//   // }

//   private handleLoginFailure(message?: string) {
//     this.submitted = false;
//     this.invalidLogin = true;
//     this.btnCaption = 'Login';

//     this.messageService.add({
//       severity: 'error',
//       summary: '',
//       detail: message ?? 'Login failed'
//     });
//   }

//   private handleLoginError(err: any) {
//     this.submitted = false;
//     this.invalidLogin = true;
//     this.btnCaption = 'Login';

//     const detail =
//       err === 'Action failed due to server error.'
//         ? 'Action failed due to server error.'
//         : 'Access Denied!. Incorrect username or password.';

//     this.messageService.add({ severity: 'error', summary: '', detail });
//   }


//   login(): void {
//     this.router.navigate(["/auth/login"]);
//   }


// }

