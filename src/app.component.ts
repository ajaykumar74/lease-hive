import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/shared/auth.inteceptor';

 

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule ], 
    template: `<router-outlet></router-outlet>`,
     providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]

})
export class AppComponent  {} 
