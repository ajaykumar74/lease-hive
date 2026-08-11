import { RouterModule, Routes } from '@angular/router';
import { Login } from './login';
import { NgModule } from '@angular/core';
import { ForgotPassword } from './forgotpassword';
import { ResetPassword } from './reset-password'; 

const routes: Routes = [
    { path: '', component: Login },
    { path: 'login', component: Login },
    { path: 'forgot', component: ForgotPassword },
    { path: 'reset-password', component: ResetPassword }, 
     //{ path: 'register-success', component: ExternalRegisterSuccess },
] as Routes;

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AuthenticationRoutingModule { } 