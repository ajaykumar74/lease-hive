import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@/shared/auth-guard.service';
import { AssetCatalogueListComponent } from './assetCatalogue-list.component';
import { AssetCatalogueEditorComponent } from './assetCatalogue-editor.component';

const routes: Routes = [{ path: '', canActivate: [AuthGuard], children: [
    { path: '', component: AssetCatalogueListComponent }, { path: 'create', component: AssetCatalogueEditorComponent },
    { path: 'edit/:id', component: AssetCatalogueEditorComponent }, { path: 'view/:id', component: AssetCatalogueEditorComponent }
]}];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] }) export class AssetCatalogueRoutingModule { }
