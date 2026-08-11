import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from '@/shared/auth.inteceptor'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        importProvidersFrom(JwtModule.forRoot({
            config: {
              tokenGetter: () => {
                return    localStorage.getItem("jwt");; // Or however you store your token
              },
              allowedDomains: ['https://localhost:44311','http://vlootadmin-001-site1.ptempurl.com','http://vloot.in', 'https://localhost:7273'], // Whitelist your API domain(s) 
            },
          })),
        
        provideHttpClient(withFetch()),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
       
    ]
};
