import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';  
import { SettingsViewComponent } from './settings-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'Settings'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: SettingsViewComponent,      
        data: {
          title: 'View'
        }
      }
    ]
  }
];

  
@NgModule({
  declarations: [],
  imports: [
      RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule { } 
 