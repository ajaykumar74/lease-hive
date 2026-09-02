import { NgModule } from '@angular/core'; 
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@/shared/auth-guard.service';
import { ContractAssetReturnInstructionListComponent } from './contractAssetReturnInstruction-list.component';
import { ContractAssetReturnInstructionCreateComponent } from './contractAssetReturnInstruction-create.component';
import { ContractAssetReturnInstructionEditComponent } from './contractAssetReturnInstruction-edit.component';
import { ContractAssetReturnInstructionViewComponent } from './contractAssetReturnInstruction-view.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      title: 'ContractAssetReturnInstructions'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        component: ContractAssetReturnInstructionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'list',
        canActivate: [AuthGuard],
        component: ContractAssetReturnInstructionListComponent,      
        data: {
          title: 'List'
        }
      },
      {
        path: 'create',
        canActivate: [AuthGuard],
        component: ContractAssetReturnInstructionCreateComponent,
        data: {
          title: 'Create'
        }
      },
       {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: ContractAssetReturnInstructionEditComponent 
      },
	  {
        path: 'view/:id',
        canActivate: [AuthGuard],
        component: ContractAssetReturnInstructionViewComponent 
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
export class ContractAssetReturnInstructionRoutingModule { } 
 