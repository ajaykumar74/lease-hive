import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyAccessComponent } from './myAccess.component';

const routes: Routes = [
    {
        path: '',
        component: MyAccessComponent,
        data: {
            title: 'My Access',
            breadcrumb: 'My Access'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyAccessRoutingModule {
}
