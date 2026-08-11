import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

import { environment } from './environments/environment';

if (environment.envName == 'prod' || environment.envName == 'qa'  ) {
  enableProdMode();
}

bootstrapApplication(AppComponent, 
  appConfig).catch((err) => console.error(err));
